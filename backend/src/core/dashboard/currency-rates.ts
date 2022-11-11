import { Base } from '../base'
import { randomUUID } from 'crypto'
import {
  IBeforeDate,
  IConfigOptions,
  ICurrencyCode,
  IDashboardCurrencyRate,
  ILast90Data
} from './dashboard.interface'
import { OracleService } from '../../oracle/oracle.service'
import { format } from 'date-fns'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'

export class CurrencyRates extends Base {
  constructor(
    date: Date,
    oracleService: OracleService,
    private readonly configOptions: IConfigOptions,
    private readonly httpService: HttpService
  ) {
    super(date, oracleService)
  }

  protected currencyCodes = [
    { code: '978', currName: 'EUR', nominal: '1 EUR', equival: 0, differ: 0 },
    { code: '840', currName: 'USD', nominal: '1 USD', equival: 0, differ: 0 },
    { code: '826', currName: 'GBP', nominal: '1 GBP', equival: 0, differ: 0 },
    { code: '756', currName: 'CHF', nominal: '1 CHF', equival: 0, differ: 0 },
    { code: '643', currName: 'RUB', nominal: '1 RUB', equival: 0, differ: 0 },
    { code: '398', currName: 'KZT', nominal: '1 KZT', equival: 0, differ: 0 },
    { code: '392', currName: 'JPY', nominal: '1 JPY', equival: 0, differ: 0 },
    { code: '156', currName: 'CNY', nominal: '1 CNY', equival: 0, differ: 0 }
  ]

  protected formatQuery() {
    return `SELECT DAY.CODE                                   AS "code",
                   ROUND(DAY.EQUIVAL, 2)                      AS "equival",
                   ROUND(DAY.EQUIVAL - BEFORE_DAY.EQUIVAL, 2) AS "differ"
            FROM (SELECT CODE,
                         EQUIVAL
                  FROM IBS.S_RATE_CUR@IABS
                  WHERE DATE_CROSS = DATE '${this.date}'
                    AND CODE IN ('978', '840', '826', '756',
                                 '643', '398', '392', '156')) DAY
                     JOIN (SELECT CODE,
                                  EQUIVAL
                           FROM IBS.S_RATE_CUR@IABS
                           WHERE DATE_CROSS = (SELECT MAX(OPER_DAY)
                                               FROM IBS.DAY_OPERATIONAL@IABS
                                               WHERE OPER_DAY < DATE '${this.date}')
                             AND CODE IN ('978', '840', '826', '756',
                                          '643', '398', '392', '156')) BEFORE_DAY
                          ON DAY.CODE = BEFORE_DAY.CODE`
  }

  protected getBeforeDateQuery = () => {
    return `SELECT OPER_DAY AS "beforeDate"
            FROM IBS.DAY_OPERATIONAL@IABS
            WHERE OPER_DAY < DATE '${this.date}'
            ORDER BY OPER_DAY DESC FETCH FIRST ROW ONLY`
  }

  protected getLast90Query(currencyCode = '840') {
    return `SELECT TO_CHAR(EVERY_FRIDAY.MAX_DAY, 'DD.MM.YYYY') AS "currDay",
                   CURR.EQUIVAL                                AS "equival"
            FROM (SELECT TO_CHAR(TO_DATE(DATE_CROSS, 'DD.MM.YYYY'), 'WW') week_number,
                         MAX(DATE_CROSS)                max_day
                  FROM IBS.S_RATE_CUR@IABS
                  WHERE DATE_CROSS BETWEEN DATE '${this.date}' - 90 AND
                            DATE '${this.date}'
                  GROUP BY TO_CHAR(TO_DATE(DATE_CROSS, 'DD.MM.YYYY'), 'WW')) EVERY_FRIDAY
                     JOIN IBS.S_RATE_CUR@IABS CURR
                          ON CURR.DATE_CROSS = EVERY_FRIDAY.MAX_DAY
            WHERE CURR.CODE = '${currencyCode}'`
  }

  protected getOtherRatesWithDiffer(rate = [], rateBeforeDay = []) {
    return rate.map((curr, index) => ({
      ...curr,
      rateSalDiffer: (curr['rateSal'] || 0) - ((rateBeforeDay[index] || 0)['rateSal'] || 0),
      rateParchDiffer: (curr['rateParch'] || 0) - ((rateBeforeDay[index] || 0)['rateParch'] || 0)
    }))
  }

  protected async getCBRate() {
    return await this.getDataInDates<IDashboardCurrencyRate, true>('1=1', undefined, true)
  }

  protected async getRatesByType(token = '', type = 3, date?: Date) {
    const requestId = `${randomUUID()}__${Date.now()}`
    const formattedDate = format(new Date(date || this.date), 'dd.MM.yyyy')
    const res = await this.httpService.get(
      `http://172.16.50.79:9099/1.0.0/internationalCard/getListExchangeRates?dateCross=${formattedDate}%2009%3A00%3A00`,
      {
        params: {
          currencyCode: 'ALL',
          destinationType: type
        },
        headers: {
          accept: 'application/json',
          requestId: requestId,
          'Accept-Language': 'en',
          Authorization: `Bearer ${token}`
        }
      }
    )
    const { data } = await lastValueFrom(res)
    const { responseBody = {} } = data
    const { data: arrayData } = responseBody
    const filteredData = (arrayData || [])
      .map(r => {
        let returnRow = {}
        this.currencyCodes.forEach(c => {
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
      })
      .filter((r: any) => Object.keys(r).length)
    return filteredData.sort((a: ICurrencyCode, b: ICurrencyCode) => {
      if (a.code < b.code) return 1
      if (a.code > b.code) return -1
      return 0
    })
  }

  protected async getOtherRates() {
    const res = await this.httpService.post(
      'http://172.16.50.79:9099/getToken',
      this.configOptions,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    const { data } = await lastValueFrom(res)
    const { token } = data
    let legalEntitiesRates = await this.getRatesByType(token, 6)
    let individualsRates = await this.getRatesByType(token, 3)
    const { beforeDate } = await this.getDataInDates<IBeforeDate>(
      undefined,
      this.getBeforeDateQuery
    )
    const legalEntitiesRatesBeforeDay = await this.getRatesByType(token, 6, beforeDate)
    const individualsRatesBeforeDay = await this.getRatesByType(token, 3, beforeDate)
    legalEntitiesRates = this.getOtherRatesWithDiffer(
      legalEntitiesRates,
      legalEntitiesRatesBeforeDay
    )
    individualsRates = this.getOtherRatesWithDiffer(individualsRates, individualsRatesBeforeDay)
    return { legalEntitiesRates, individualsRates }
  }

  async getLast90() {
    const resultData = {}
    await Promise.all(
      this.currencyCodes.map(async ({ code, nominal }) => {
        const currName = nominal.split(' ')[1]
        resultData[currName] = await this.getDataInDates<ILast90Data, true>(
          undefined,
          this.getLast90Query.bind(this, code),
          true
        )
      })
    )
    return resultData
  }

  async getRows() {
    const last90Rates = await this.getLast90()
    const cbRateData = await this.getCBRate()
    const cbRate = this.currencyCodes.map(row => {
      for (let i = 0; i < cbRateData.length; i++) {
        if (cbRateData[i]['code'] === row['code']) {
          row['equival'] = +(cbRateData[i]['equival'] || 0).toFixed(2)
          row['differ'] = +(cbRateData[i]['differ'] || 0).toFixed(2)
        }
      }
      return row
    })
    try {
      const { legalEntitiesRates = [], individualsRates = [] } = await this.getOtherRates()
      return [cbRate, legalEntitiesRates, individualsRates, last90Rates]
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message)
      }
      return new Array(4).fill([])
    }
  }
}
