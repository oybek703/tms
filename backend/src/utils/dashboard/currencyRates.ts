import DashboardMainClass from './dashboardMainClass'
import { randomUUID } from 'crypto'
import axios from 'axios'
import { formatOneDate } from '../dateFormatter'

interface CurrencyCode {
    code: string
    currName: string
    nominal: string
    equival: number
    differ: number
}

class CurrencyRates extends DashboardMainClass {
    currencyCodes: CurrencyCode[]
    constructor(date: string) {
      super(date)
      this.currencyCodes = [
        { code: '978', currName: 'EUR', nominal: '1 EUR', equival: 0, differ: 0 },
        { code: '840', currName: 'USD', nominal: '1 USD', equival: 0, differ: 0 },
        { code: '826', currName: 'GBP', nominal: '1 GBP', equival: 0, differ: 0 },
        { code: '756', currName: 'CHF', nominal: '1 CHF', equival: 0, differ: 0 },
        { code: '643', currName: 'RUB', nominal: '1 RUB', equival: 0, differ: 0 },
        { code: '398', currName: 'KZT', nominal: '1 KZT', equival: 0, differ: 0 },
        { code: '392', currName: 'JPY', nominal: '1 JPY', equival: 0, differ: 0 },
        { code: '156', currName: 'CNY', nominal: '1 CNY', equival: 0, differ: 0 },
      ]
    }

    formatQuery(date: string) {
      return `SELECT DAY.CODE CODE,
                       ROUND(DAY.EQUIVAL, 2) EQUIVAL,
                       ROUND(DAY.EQUIVAL - BEFORE_DAY.EQUIVAL, 2) DIFFER
                FROM   (SELECT
                               CODE,
                               EQUIVAL
                        FROM   IBS.S_RATE_CUR@IABS
                        WHERE  DATE_CROSS = TO_DATE('${date}', 'DD.MM.YYYY')
                          AND CODE IN ( '978', '840', '826', '756',
                                        '643', '398', '392', '156')) DAY
                           JOIN (SELECT CODE,
                                        EQUIVAL
                                 FROM   IBS.S_RATE_CUR@IABS
                                 WHERE  DATE_CROSS = (SELECT MAX(OPER_DAY)
                                                      FROM   IBS.DAY_OPERATIONAL@IABS
                                                      WHERE  OPER_DAY < TO_DATE('${date}',
                                                                                'DD.MM.YYYY'))
                                   AND CODE IN ( '978', '840', '826', '756',
                                                 '643', '398', '392', '156')) BEFORE_DAY
                                ON DAY.CODE = BEFORE_DAY.CODE`
    }

    getBeforeDateQuery() {
      return `SELECT OPER_DAY
                FROM IBS.DAY_OPERATIONAL@IABS
                WHERE OPER_DAY < TO_DATE('${this.date}', 'DD-MM-YYYY') ORDER BY OPER_DAY DESC FETCH FIRST ROW ONLY`
    }

    getLast90Query(date: string, currencyCode: string = '840') {
      return `SELECT TO_CHAR(EVERY_FRIDAY.MAX_DAY, 'DD.MM.YYYY') CURR_DAY,
                   CURR.EQUIVAL
                FROM (SELECT TO_CHAR(TO_DATE(DATE_CROSS, 'DD.MM.YYYY'), 'WW') week_number,
                         MAX(DATE_CROSS)                                  max_day
                  FROM IBS.S_RATE_CUR@IABS
                  WHERE DATE_CROSS BETWEEN TO_DATE('${date}', 'DD.MM.YYYY') - 90 AND
                            TO_DATE('${date}', 'DD.MM.YYYY')
                  GROUP BY TO_CHAR(TO_DATE(DATE_CROSS, 'DD.MM.YYYY'), 'WW')) EVERY_FRIDAY
                     JOIN IBS.S_RATE_CUR@IABS CURR
                          ON CURR.DATE_CROSS = EVERY_FRIDAY.MAX_DAY
                WHERE CURR.CODE = '${currencyCode}'`
    }

    getOtherRatesWithDiffer(rate = [], rateBeforeDay = []) {
      return rate.map((curr: any, index) => ({
        ...curr,
        rateSalDiffer: (curr['rateSal'] || 0) - ((rateBeforeDay[index] || 0)['rateSal'] || 0),
        rateParchDiffer: (curr['rateParch'] || 0) - ((rateBeforeDay[index] || 0)['rateParch'] || 0)
      }))
    }

    async getCBRate() {
      return await this.getDataInDates(
          '1=1',
          null,
          true
      )
    }

    async getRatesByType(token: string = '', type: number = 3, date: string = '') {
      const requestId = `${randomUUID()}__${Date.now()}`
      // eslint-disable-next-line max-len
      const { data } = await axios.get(`http://172.16.50.79:9099/1.0.0/internationalCard/getListExchangeRates?dateCross=${date || this.date}%2009%3A00%3A00`, {
        params: {
          currencyCode: 'ALL',
          destinationType: type
        },
        headers: {
          'accept': 'application/json',
          'requestId': requestId,
          'Accept-Language': 'en',
          'Authorization': `Bearer ${token}`
        }
      })
      const { responseBody = {} } = data
      const { data: arrayData } = responseBody
      const filteredData = (arrayData || []).map((r: any) => {
        let returnRow = {}
        this.currencyCodes.forEach((c) => {
          if (c['code'] === r['currencyCode']) {
            returnRow = {
              code: c['code'],
              nominal: c['nominal'],
              rateSal: r['rateSal'] / 100,
              rateParch: r['rateParch'] / 100
            }
          }
        })
        return returnRow
      }).filter((r: any) => Object.keys(r).length)
      return filteredData.sort((a: CurrencyCode, b: CurrencyCode) => {
        if (a.code < b.code) return 1
        if (a.code > b.code) return -1
        return 0
      })
    }

    async getOtherRates() {
      const { data = {} } = await axios.post('http://172.16.50.79:9099/getToken',
          {
            username: process.env.CURRENCY_LOGIN,
            password: process.env.CURRENCY_PASSWORD
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          })
      const { token } = data
      let legalEntitiesRates = await this.getRatesByType(token, 6)
      let individualsRates = await this.getRatesByType(token, 3)
      const { OPER_DAY } = await this.getDataInDates('', this.getBeforeDateQuery.bind(this))
      const beforeSelectedDate = formatOneDate(OPER_DAY)
      const legalEntitiesRatesBeforeDay = await this.getRatesByType(token, 6, beforeSelectedDate)
      const individualsRatesBeforeDay = await this.getRatesByType(token, 3, beforeSelectedDate)
      legalEntitiesRates = this.getOtherRatesWithDiffer(legalEntitiesRates, legalEntitiesRatesBeforeDay)
      individualsRates = this.getOtherRatesWithDiffer(individualsRates, individualsRatesBeforeDay)
      return { legalEntitiesRates, individualsRates }
    }

    async getLast90() {
      const resultData: any = {}
      await Promise.all(this.currencyCodes.map(async ({ code, nominal }) => {
        const currName = nominal.split(' ')[1]
        resultData[currName] = await this.getDataInDates(
            '',
            this.getLast90Query.bind(this, this.date, code),
            true
        )
      }))
      return resultData
    }

    async getRows() {
      const last90Rates = await this.getLast90()
      const cbRateData = await this.getCBRate()
      const cbRate = this.currencyCodes.map((row) => {
        for (let i = 0; i < cbRateData.length; i++) {
          if (cbRateData[i]['CODE'] === row['code']) {
            row['equival'] = +(cbRateData[i]['EQUIVAL'] || 0).toFixed(2)
            row['differ'] = +(cbRateData[i]['DIFFER'] || 0).toFixed(2)
          }
        }
        return row
      })
      try {
        const { legalEntitiesRates = [], individualsRates = [] } = await this.getOtherRates()
        return { cbRate, legalEntitiesRates, individualsRates, last90Rates }
      } catch (e) {
        console.log(e)
        return { cbRate, legalEntitiesRates: [], individualsRates: [], last90Rates: {} }
      }
    }
}

export default CurrencyRates
