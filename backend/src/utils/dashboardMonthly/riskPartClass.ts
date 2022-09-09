import DashboardMonthlyMainClass from './dashboardMonthlyMainClass'

/* eslint-disable camelcase */
class RiskPartClass extends DashboardMonthlyMainClass {
  constructor(firstDate: string, secondDate: string, dateOption: string) {
    super(firstDate, secondDate, dateOption)
  }

  creditPortfolioQuery(curr: string) {
    const onlyTwo = `SELECT OPER_DAY DAT,
                               ROUND(SUM(TOTAL_LOAN) / POWER(10, 6), 2) AS SUM
                         FROM   CR.VIEW_CREDITS_DWH@RISK
                         WHERE  OPER_DAY = TO_DATE('${this.firstDate}', 'dd.mm.yyyy') AND 
                              ${curr ? curr === '000' ? `CURRENCY='000'` : `CURRENCY!='000'` : '1=1'}
                         GROUP  BY OPER_DAY
                         UNION
                         SELECT OPER_DAY DAT,
                               ROUND(SUM(TOTAL_LOAN) / POWER(10, 6), 2) AS SUM
                         FROM   CR.VIEW_CREDITS_DWH@RISK
                         WHERE  OPER_DAY = TO_DATE('${this.secondDate}', 'dd.mm.yyyy') AND 
                              ${curr ? curr === '000' ? `CURRENCY='000'` : `CURRENCY!='000'` : '1=1'}
                         GROUP  BY OPER_DAY ORDER BY DAT`

    const all = `SELECT OPER_DAY                                                       DAT,
                           TO_CHAR(OPER_DAY, 'DD.MM.YYYY') AS DATE_VALUE,
                           ROUND(SUM(TOTAL_LOAN) / POWER(10, 6), 2)                    AS SUM
                    FROM CR.VIEW_CREDITS_DWH@RISK
                    WHERE OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'dd.mm.yyyy') AND TO_DATE('${this.secondDate}', 'dd.mm.yyyy')
                      AND ${curr ? curr === '000' ? `CURRENCY='000'` : `CURRENCY!='000'` : '1=1'}
                    GROUP BY OPER_DAY ORDER BY DAT`
    const month = `SELECT OPER_DAY DAT,
                               TO_CHAR(TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM'), 'DD.MM.YYYY')     AS MONTH_BEGIN,
                               ROUND(SUM(TOTAL_LOAN) / POWER(10, 6), 2) AS SUM
                        FROM   CR.VIEW_CREDITS_DWH@RISK
                        WHERE  OPER_DAY IN (SELECT MAX(OPER_DAY)
                                            FROM   CR.VIEW_CREDITS_DWH@RISK --Кредитный портфель
                                            WHERE  OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'dd.mm.yyyy')
                                                       AND
                                                       TO_DATE('${this.secondDate}', 'dd.mm.yyyy')
                                            GROUP  BY EXTRACT(YEAR FROM OPER_DAY),
                                                      EXTRACT(MONTH FROM OPER_DAY)
                                            UNION
                                            SELECT TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                                            FROM   DUAL) 
                                            ${curr ? curr === '000' ? `AND CURRENCY='000'` : `AND CURRENCY!='000'` : ''}
                        GROUP  BY OPER_DAY ORDER  BY DAT`
    return this.chooseQuery(onlyTwo, all, month)
  }

  creditPortfolioRateQuery(curr: string) {
    const onlyTwo = `SELECT OPER_DAY DAT,
                               ROUND(SUM(TOTAL_LOAN * CREDIT_PERCENT) / POWER(10, 6), 2) AS SUM
                        FROM   CR.VIEW_CREDITS_DWH@RISK
                        WHERE  OPER_DAY = TO_DATE('${this.firstDate}', 'dd.mm.yyyy') AND 
                              ${curr ? curr === '000' ? `CURRENCY='000'` : `CURRENCY!='000'` : '1=1'}
                        GROUP  BY OPER_DAY
                        UNION
                        SELECT OPER_DAY DAT,
                               ROUND(SUM(TOTAL_LOAN * CREDIT_PERCENT) / POWER(10, 6), 2) AS SUM
                        FROM   CR.VIEW_CREDITS_DWH@RISK
                        WHERE  OPER_DAY = TO_DATE('${this.secondDate}', 'dd.mm.yyyy') AND 
                              ${curr ? curr === '000' ? `CURRENCY='000'` : `CURRENCY!='000'` : '1=1'}
                        GROUP  BY OPER_DAY ORDER BY DAT`

    const all = `SELECT OPER_DAY DAT,
                           TO_CHAR(OPER_DAY, 'DD.MM.YYYY') AS DATE_VALUE,
                           ROUND(SUM(TOTAL_LOAN * CREDIT_PERCENT) / POWER(10, 6), 2) AS SUM
                    FROM   CR.VIEW_CREDITS_DWH@RISK
                    WHERE  OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'dd.mm.yyyy') 
                        AND TO_DATE('${this.secondDate}', 'dd.mm.yyyy') AND
                        ${curr ? curr === '000' ? `CURRENCY='000'` : `CURRENCY!='000'` : '1=1'}
                    GROUP  BY OPER_DAY ORDER BY DAT`
    const month = `SELECT OPER_DAY DAT,
                               TO_CHAR(TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM'), 'DD.MM.YYYY') AS MONTH_BEGIN,
                               ROUND(SUM(TOTAL_LOAN * CREDIT_PERCENT) / POWER(10, 6), 2) AS SUM
                        FROM   CR.VIEW_CREDITS_DWH@RISK
                        WHERE  OPER_DAY IN (SELECT MAX(OPER_DAY)
                                            FROM   CR.VIEW_CREDITS_DWH@RISK
                                            WHERE  OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'dd.mm.yyyy')
                                                       AND
                                                       TO_DATE('${this.secondDate}', 'dd.mm.yyyy')
                                            GROUP  BY EXTRACT(YEAR FROM OPER_DAY),
                                                      EXTRACT(MONTH FROM OPER_DAY)
                                            UNION
                                            SELECT TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                                            FROM DUAL ) ${curr ? curr === '000' ? `AND CURRENCY='000'` : `AND CURRENCY!='000'` : ''}
                        GROUP  BY OPER_DAY ORDER BY DAT`
    return this.chooseQuery(onlyTwo, all, month)
  }

  PARQuery(whereQuery = '1=1') {
    const onlyTwo = `SELECT OPER_DAY DAT,
                               ROUND(SUM(OVERDUE_SALDO) / POWER(10, 6), 2) AS SUM
                        FROM CR.VIEW_CREDITS_DWH@RISK
                        WHERE OPER_DAY = TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                          AND ${whereQuery}
                        GROUP BY OPER_DAY
                        UNION
                        SELECT OPER_DAY DAT,
                               ROUND(SUM(OVERDUE_SALDO) / POWER(10, 6), 2) AS SUM
                        FROM CR.VIEW_CREDITS_DWH@RISK
                        WHERE OPER_DAY = TO_DATE('${this.secondDate}', 'DD.MM.YYYY')
                          AND ${whereQuery}
                        GROUP BY OPER_DAY ORDER BY DAT`
    const all = `SELECT OPER_DAY DAT,
                           TO_CHAR(OPER_DAY, 'DD.MM.YYYY') DATE_VALUE,
                           ROUND(SUM(OVERDUE_SALDO) / POWER(10, 6), 2) AS SUM
                    FROM CR.VIEW_CREDITS_DWH@RISK
                    WHERE OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'DD.MM.YYYY') AND TO_DATE('${this.secondDate}', 'DD.MM.YYYY')
                      AND ${whereQuery}
                    GROUP BY OPER_DAY ORDER BY DAT`
    const month = `SELECT OPER_DAY DAT,
                           TO_CHAR(TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM'), 'DD.MM.YYYY') AS MONTH_BEGIN,
                           ROUND(SUM(OVERDUE_SALDO) / POWER(10, 6), 2)                 AS SUM
                        FROM CR.VIEW_CREDITS_DWH@RISK
                        WHERE OPER_DAY IN (SELECT MAX(OPER_DAY)
                                       FROM CR.VIEW_CREDITS_DWH@RISK --PAR
                                       WHERE OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'DD.MM.YYYY') 
                                           AND 
                                           TO_DATE('${this.secondDate}', 'DD.MM.YYYY')
                                       GROUP BY EXTRACT(YEAR FROM OPER_DAY), EXTRACT(MONTH FROM OPER_DAY)
                                       UNION
                                       SELECT TO_DATE('${this.firstDate}', 'DD.MM.YYYY') FROM DUAL)
                                       AND ${whereQuery}
                        GROUP BY OPER_DAY ORDER BY DAT`
    return this.chooseQuery(onlyTwo, all, month)
  }

  NPLAndToxicQuery(whereQuery = `CREDIT_STATUS = 2`) {
    const onlyTwo = `SELECT OPER_DAY DAT,
                               ROUND(SUM(TOTAL_LOAN) / POWER(10, 6), 2) AS SUM
                        FROM CR.VIEW_CREDITS_DWH@RISK
                        WHERE OPER_DAY = TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                          AND ${whereQuery}
                        GROUP BY OPER_DAY
                        UNION
                        SELECT OPER_DAY DAT,
                               ROUND(SUM(TOTAL_LOAN) / POWER(10, 6), 2) AS SUM
                        FROM CR.VIEW_CREDITS_DWH@RISK
                        WHERE OPER_DAY = TO_DATE('${this.secondDate}', 'DD.MM.YYYY')
                          AND ${whereQuery}
                        GROUP BY OPER_DAY`

    const all = `SELECT OPER_DAY DAT,
                       TO_CHAR(OPER_DAY, 'DD.MM.YYYY')             DATE_VALUE,
                       ROUND(SUM(TOTAL_LOAN) / POWER(10, 6), 2) AS SUM
                    FROM CR.VIEW_CREDITS_DWH@RISK
                    WHERE OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                          AND TO_DATE('${this.secondDate}', 'DD.MM.YYYY') AND ${whereQuery}
                    GROUP BY OPER_DAY ORDER BY DAT`
    const month = `SELECT OPER_DAY                                    DAT,
                               TO_CHAR(TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM'), 'DD.MM.YYYY') AS MONTH_BEGIN,
                               ROUND(SUM(TOTAL_LOAN) / POWER(10, 6), 2) AS SUM
                        FROM CR.VIEW_CREDITS_DWH@RISK
                        WHERE OPER_DAY IN (SELECT MAX(OPER_DAY)
                                           FROM CR.VIEW_CREDITS_DWH@RISK
                                           WHERE OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                                                     AND
                                                     TO_DATE('${this.secondDate}', 'DD.MM.YYYY')
                                           GROUP BY EXTRACT(YEAR FROM OPER_DAY),
                                                    EXTRACT(MONTH FROM OPER_DAY)
                                           UNION
                                           SELECT TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                                           FROM DUAL)
                          AND ${whereQuery}
                        GROUP BY OPER_DAY
                        ORDER BY DAT`
    return this.chooseQuery(onlyTwo, all, month)
  }

  reserveQuery() {
    const onlyTwo = `SELECT OPER_DAY      DAT,
                               ABS(SELECTED_DATE_IN) SUM
                        FROM MAININDICATORS
                        WHERE OPER_DAY IN (TO_DATE('${this.firstDate}', 'DD.MM.YYYY'),
                                           TO_DATE('${this.secondDate}', 'DD.MM.YYYY'))
                          AND ROLE = 'P_L_R'`
    const all = `SELECT OPER_DAY      DAT,
                           TO_CHAR(OPER_DAY, 'DD.MM.YYYY') DATE_VALUE,
                           ABS(SELECTED_DATE_IN) SUM
                    FROM MAININDICATORS
                    WHERE OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'DD.MM.YYYY') AND
                                       TO_DATE('${this.secondDate}', 'DD.MM.YYYY')
                      AND ROLE = 'P_L_R'`
    const month = `SELECT OPER_DAY DAT,
                               TO_CHAR(TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM'), 'DD.MM.YYYY') AS MONTH_BEGIN,
                               ABS(SELECTED_DATE_IN)                           SUM
                        FROM MAININDICATORS
                        WHERE OPER_DAY IN (SELECT MAX(OPER_DAY)
                                           FROM MAININDICATORS
                                           WHERE OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                                                     AND
                                                     TO_DATE('${this.secondDate}', 'DD.MM.YYYY')
                                           GROUP BY EXTRACT(MONTH FROM OPER_DAY),
                                                    EXTRACT(YEAR FROM OPER_DAY)
                                           UNION
                                           SELECT TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                                           FROM DUAL)
                          AND ROLE = 'P_L_R' ORDER BY DAT`
    return this.chooseQuery(onlyTwo, all, month)
  }

  async credit_portfolio() {/* Кредитный портфель */
    const data = await this.getDataInDates(
        '',
        this.creditPortfolioQuery.bind(this),
        true
    )
    return this.createData('1', 'Кредитный портфель', data, true)
  } /* Кредитный портфель */

  async credit_portfolio_nat_curr() {/* в том числе в нац.валюте */
    const data = await this.getDataInDates(
        '',
        this.creditPortfolioQuery.bind(this, '000'),
        true
    )
    return this.createData('1.1', 'в том числе в нац.валюте', data, true)
  } /* в том числе в нац.валюте */

  async credit_portfolio_rate_nat_curr(creditPortfolioNatCurr: any) {/* -средневзвешенные процентные ставки */
    const data = await this.getDataInDates(
        '',
        this.creditPortfolioRateQuery.bind(this, '000'),
        true
    )
    const { data: creditPortfolioData } = creditPortfolioNatCurr
    const updatedData = data.map((d: any, i: number) => ({
      ...d,
      ['SUM']: +(d['SUM']/creditPortfolioData[i]['SUM']).toFixed(2)
    }))
    return this.createData('', '-средневзвешенные процентные ставки', updatedData, false, true)
  } /* -средневзвешенные процентные ставки */

  async credit_portfolio_for_curr() {/* в том числе в иностранной валюте */
    const data = await this.getDataInDates(
        '',
        this.creditPortfolioQuery.bind(this, 'foreign'),
        true
    )
    return this.createData('1.2', 'в том числе в иностранной валюте', data, true)
  } /* в том числе в иностранной валюте */

  async credit_portfolio_rate_for_curr(creditPortfolioForCurr: any) {/* -средневзвешенные процентные ставки */
    const data = await this.getDataInDates(
        '',
        this.creditPortfolioRateQuery.bind(this, 'foreign'),
        true
    )
    const { data: creditPortfolioData } = creditPortfolioForCurr
    const updatedData = data.map((d: any, i: number) => ({
      ...d,
      ['SUM']: +(d['SUM']/creditPortfolioData[i]['SUM']).toFixed(2)
    }))
    return this.createData('', '-средневзвешенные процентные ставки', updatedData, false, true)
  } /* -средневзвешенные процентные ставки */

  async par_30() {/* PAR<30 */
    const data = await this.getDataInDates(
        '',
        this.PARQuery.bind(this, `(OPER_DAY - OVERDUE_DATE) <= 30`),
        true
    )
    return this.createData('2', 'PAR<30', data, true)
  } /* PAR<30 */

  async par_60() {/* PAR<60 */
    const data = await this.getDataInDates(
        '',
        this.PARQuery.bind(this, `(OPER_DAY - OVERDUE_DATE) > 30 AND (OPER_DAY - OVERDUE_DATE) <= 60`),
        true
    )
    return this.createData('2.1', 'PAR<60', data, true)
  } /* PAR<60 */

  async par_90() {/* PAR<90 */
    const data = await this.getDataInDates(
        '',
        this.PARQuery.bind(this, `(OPER_DAY - OVERDUE_DATE) > 60 AND (OPER_DAY - OVERDUE_DATE) <= 90`),
        true
    )
    return this.createData('2.2', 'PAR<90', data, true)
  } /* PAR<90 */

  // TODO -средневзвешенные маржа банка

  async npl() {/* NPL */
    const data = await this.getDataInDates(
        '',
        this.NPLAndToxicQuery.bind(this, `CREDIT_STATUS = 2`),
        true
    )
    return this.createData('3', 'NPL', data, true)
  } /* NPL */

  async toxic() {/* Реструктиризация (токсичные) */
    const data = await this.getDataInDates(
        '',
        this.NPLAndToxicQuery.bind(this, `IS_TOXIC=1`),
        true
    )
    return this.createData('4', 'Реструктиризация (токсичные)', data, true)
  } /* Реструктиризация (токсичные) */

  npl_share(NPL: any, creditPortfolio: any) {/* Уделный вес NPL к портфелю */
    const { data: NPLData } = NPL
    const { data: creditPortfolioData } = creditPortfolio
    const updatedData = NPLData.map((d: any, i: number) => ({
      ...d,
      ['SUM']: +(d['SUM']*100/creditPortfolioData[i]['SUM']).toFixed(2)
    }))
    return this.createData('5', 'Уделный вес NPL к портфелю', updatedData, true, true)
  } /* Уделный вес NPL к портфелю */

  async reserve() {/* Резервы */
    const data = await this.getDataInDates(
        '',
        this.reserveQuery.bind(this),
        true
    )
    return this.createData('6', 'Резервы', data, true)
  } /* NPL */

  // @ts-ignore
  async getRows() {
    try {
      const [
        creditPortfolio,
        creditPortfolioNatCurr,
        creditPortfolioForCurr,
        PAR30, PAR60, PAR90,
        NPLData, toxicData,
        reserveData
      ] = await Promise.all([
        this.credit_portfolio(),
        this.credit_portfolio_nat_curr(),
        this.credit_portfolio_for_curr(),
        this.par_30(),
        this.par_60(),
        this.par_90(),
        this.npl(),
        this.toxic(),
        this.reserve()
      ])
      const creditPortfolioRateNatCurr = await this.credit_portfolio_rate_nat_curr(creditPortfolioNatCurr)
      const creditPortfolioRateForCurr = await this.credit_portfolio_rate_for_curr(creditPortfolioForCurr)
      const NPLShare = this.npl_share(NPLData, creditPortfolio)
      return [
        // КАЧЕСТВО АКТИВОВ
        creditPortfolio,
        creditPortfolioNatCurr,
        creditPortfolioRateNatCurr,
        creditPortfolioForCurr,
        creditPortfolioRateForCurr,
        PAR30, PAR60, PAR90, NPLData,
        toxicData, NPLShare, reserveData
      ]
    } catch (e) {
      console.log(e)
      return []
    }
  }
}

export default RiskPartClass
