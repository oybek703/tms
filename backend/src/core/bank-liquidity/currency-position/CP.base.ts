import { Base } from '../../base'
import { ICurrencyPositionDbData, ICurrencyPositionRow, ITableSumData } from './CP.interface'

export class CurrencyPositionBase extends Base {
  private currencyCodes = [
    { code: '036', isHead: false },
    { code: '051', isHead: false },
    { code: '124', isHead: false },
    { code: '156', isHead: true },
    { code: '203', isHead: false },
    { code: '344', isHead: false },
    { code: '356', isHead: false },
    { code: '364', isHead: false },
    { code: '376', isHead: false },
    { code: '392', isHead: true },
    { code: '398', isHead: true },
    { code: '410', isHead: false },
    { code: '417', isHead: false },
    { code: '458', isHead: false },
    { code: '643', isHead: true },
    { code: '682', isHead: false },
    { code: '752', isHead: false },
    { code: '756', isHead: true },
    { code: '760', isHead: false },
    { code: '764', isHead: false },
    { code: '784', isHead: false },
    { code: '818', isHead: false },
    { code: '826', isHead: true },
    { code: '840', isHead: true },
    { code: '934', isHead: false },
    { code: '944', isHead: false },
    { code: '949', isHead: false },
    { code: '960', isHead: false },
    { code: '971', isHead: false },
    { code: '972', isHead: false },
    { code: '933', isHead: false },
    { code: '978', isHead: true },
    { code: '980', isHead: false }
  ]

  protected formatQuery(whereQuery: string): string {
    return `SELECT
                       CURRENCY_CODE AS "currencyCode",
                       CURRENCY_NAME AS "currencyName",
                       RCC AS "rcc",
                       REQUIREMENTS AS "requirements",
                       CONTINGENCY_CLAIMS AS "contingencyClaims",
                       L_CL AS "lcl",
                       LIABILITIES AS "liabilities",
                       CONTINGENCY_LIABILITIES AS "contingencyLiabilities",
                       ZERO8 AS "zero8",
                       OPEN_CUR_RATE AS "openCurRate",
                       FOR_CURR_RATE AS "forCurrRate",
                       LONG_VAL AS "longVal",
                       SHORT_VAL AS "shortVal",
                       ROUND(((LONG_VAL+SHORT_VAL)*POWER(10, 2))/REG_CAP, 2) AS "posRatio" /* TODO THIS REQUIRES TO FIX REGULAR CAPITAL */
                       /* ONE MORE TODO THIS IS CHANGED IN 10.02.2022 DUE TO REGULATORY CAPITAL */
                FROM (SELECT
                   CURRENCY_CODE,
                   CURRENCY_NAME,
                   (REQUIREMENTS+CONTINGENCY_CLAIMS) AS RCC /* Требования банка в иностранной валюте, всего (в единицах ин. валюты) */,
                   REQUIREMENTS,
                   CONTINGENCY_CLAIMS,
                   (LIABILITIES+CONTINGENCY_LIABILITIES)  AS L_CL, /* Обязательства банка в иностранной валюте, всего (в единицах ин.валюты) */
                   LIABILITIES,
                   CONTINGENCY_LIABILITIES,
                   0 AS ZERO8 /* Сумма сформированного банковского капитала в иностранной валюте */,
                   (REQUIREMENTS+CONTINGENCY_CLAIMS-(LIABILITIES+CONTINGENCY_LIABILITIES)) 
                   AS OPEN_CUR_RATE, /* Открытая валютная позиция (в единицах ин.валюты,+,-) */
                   FOR_CURR_RATE,
                   (SELECT
                        CASE
                            WHEN (REQUIREMENTS+CONTINGENCY_CLAIMS-(LIABILITIES+CONTINGENCY_LIABILITIES))*FOR_CURR_RATE<0 THEN 0
                            ELSE TRUNC((REQUIREMENTS+CONTINGENCY_CLAIMS-(LIABILITIES+CONTINGENCY_LIABILITIES))*FOR_CURR_RATE, 2)
                            END
                    FROM DUAL) AS LONG_VAL, /* длинная */
                   (SELECT
                        CASE
                            WHEN (REQUIREMENTS+CONTINGENCY_CLAIMS-(LIABILITIES+CONTINGENCY_LIABILITIES))*FOR_CURR_RATE>0 THEN 0
                            ELSE TRUNC((REQUIREMENTS+CONTINGENCY_CLAIMS-(LIABILITIES+CONTINGENCY_LIABILITIES))*FOR_CURR_RATE, 2)
                            END
                    FROM DUAL) AS SHORT_VAL, /* короткая */
                   (SELECT EQUIVAL FROM (SELECT * FROM REGULATORYCAPITAL ORDER BY OPER_DAY DESC)
                    WHERE OPER_DAY < DATE '${this.date}' AND ROLE = 'R_C' AND ROWNUM = 1) AS REG_CAP
               FROM (SELECT * FROM CURRENCYPOSITION ORDER BY OPER_DAY DESC)
               WHERE OPER_DAY<DATE '${this.date}' AND CURRENCY_CODE='${whereQuery}' AND ROWNUM=1)`
  }

  private regularCapitalQuery = () => {
    return `SELECT 
                   EQUIVAL  AS "regCap"
                FROM (SELECT * FROM REGULATORYCAPITAL ORDER BY OPER_DAY DESC) 
                WHERE 
                      OPER_DAY<DATE '${this.date}' AND ROLE='R_C'
                  AND 
                      ROWNUM=1`
  }

  private async regular_capital() {
    return await this.getDataInDates<{ regCap: number }>('', this.regularCapitalQuery)
  }

  private async getOneRow(
    currencyCode1: string,
    isTableHead = false
  ): Promise<ICurrencyPositionRow> {
    const {
      currencyCode = currencyCode1,
      currencyName = 'no_data',
      rcc = 0,
      requirements = 0,
      contingencyClaims = 0,
      lcl = 0,
      liabilities = 0,
      contingencyLiabilities = 0,
      zero8 = 0,
      openCurRate = 0,
      forCurrRate = 0,
      longVal = 0,
      shortVal = 0,
      posRatio = '0'
    } = await this.getDataInDates<ICurrencyPositionDbData>(currencyCode1, undefined)
    return {
      currencyCode,
      contingencyClaims,
      contingencyLiabilities,
      currencyName,
      liabilities,
      lcl,
      forCurrRate,
      openCurRate,
      longVal,
      rcc,
      shortVal,
      posRatio,
      zero8,
      isTableHead,
      requirements
    }
  }

  async getRows(): Promise<[ICurrencyPositionRow[], ITableSumData[]]> {
    const allRows = (
      await Promise.all(this.currencyCodes.map(({ code, isHead }) => this.getOneRow(code, isHead)))
    ).map(currency => {
      if (currency.currencyName === '392') {
        // Японская йена exception
        currency['rcc'] = currency['rcc'] * 100
        currency['requirements'] = currency['requirements'] * 100
        currency['contingencyClaims'] = currency['contingencyClaims'] * 100
        currency['lcl'] = currency['lcl'] * 100
        currency['liabilities'] = currency['liabilities'] * 100
        currency['contingencyLiabilities'] = currency['contingencyLiabilities'] * 100
        currency['zero8'] = currency['zero8'] * 100
        currency['openCurRate'] = currency['openCurRate'] * 100
        currency['longVal'] = currency['longVal'] * 100
        currency['shortVal'] = currency['shortVal'] * 100
      }
      return currency
    })
    const shortTotal = allRows.reduce((acc, val) => {
      acc += val['shortVal']
      return acc
    }, 0)
    const longTotal = allRows.reduce((acc, val) => {
      acc += val['longVal']
      return acc
    }, 0)
    const longAndShortTotal = shortTotal + longTotal
    const { regCap } = await this.regular_capital()
    const tableSumData = [
      {
        title: 'Суммарная величина всех длинных валютных позиций (маx - 15%)',
        sum: longTotal,
        percent: Number((longTotal / regCap) * 100).toFixed(2)
      },
      {
        title: 'Суммарная величина всех коротких валютных позиций (маx - 15%)',
        sum: shortTotal,
        percent: Number((shortTotal / regCap) * 100).toFixed(2)
      },
      {
        title: 'Суммарная величина открытых валютных позиций (маx - 15%)',
        sum: longAndShortTotal,
        percent: Number((longAndShortTotal / regCap) * 100).toFixed(2)
      },
      { title: 'Регулятивный капитал банка на отчетную дату (в сумах)', sum: regCap, percent: 0 }
    ]
    return [allRows, tableSumData]
  }
}
