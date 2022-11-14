import { OracleService } from '../../../oracle/oracle.service'
import { DashboardMonthly } from './dashboard-monthly'
import { IDashboardMonthlyDbData } from '../dashboard.interface'

export class RiskPart extends DashboardMonthly {
  constructor(
    protected readonly firstDate,
    protected readonly secondDate,
    oracleService: OracleService,
    protected readonly dateOption?
  ) {
    super(firstDate, secondDate, oracleService, dateOption)
  }

  private creditPortfolioQuery = (curr: string) => {
    const onlyTwo = `SELECT OPER_DAY                                 AS "dat",
                            ROUND(SUM(TOTAL_LOAN) / POWER(10, 6), 2) AS "sum"
                     FROM CR.VIEW_CREDITS_DWH@RISK
                     WHERE OPER_DAY = DATE '${this.firstDate}'
                       AND ${curr ? (curr === '000' ? `CURRENCY='000'` : `CURRENCY!='000'`) : '1=1'}
                     GROUP BY OPER_DAY
                     UNION
                     SELECT OPER_DAY                                 AS "dat",
                            ROUND(SUM(TOTAL_LOAN) / POWER(10, 6), 2) AS "sum"
                     FROM CR.VIEW_CREDITS_DWH@RISK
                     WHERE OPER_DAY = DATE '${this.secondDate}'
                       AND ${curr ? (curr === '000' ? `CURRENCY='000'` : `CURRENCY!='000'`) : '1=1'}
                     GROUP BY OPER_DAY
                     ORDER BY "dat"`
    const all = `SELECT OPER_DAY                                 AS "dat",
                        TO_CHAR(OPER_DAY, 'DD.MM.YYYY')          AS "dateValue",
                        ROUND(SUM(TOTAL_LOAN) / POWER(10, 6), 2) AS "sum"
                 FROM CR.VIEW_CREDITS_DWH@RISK
                 WHERE OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE '${this.secondDate}'
                   AND ${curr ? (curr === '000' ? `CURRENCY='000'` : `CURRENCY!='000'`) : '1=1'}
                 GROUP BY OPER_DAY
                 ORDER BY "dat"`
    const month = `SELECT OPER_DAY                                                    AS "dat",
                          TO_CHAR(TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM'), 'DD.MM.YYYY') AS "monthBegin",
                          ROUND(SUM(TOTAL_LOAN) / POWER(10, 6), 2)                    AS "sum"
                   FROM CR.VIEW_CREDITS_DWH@RISK
                   WHERE OPER_DAY IN (SELECT MAX(OPER_DAY)
                                      FROM CR.VIEW_CREDITS_DWH@RISK --Кредитный портфель
                                      WHERE OPER_DAY BETWEEN DATE '${this.firstDate}'
                                                AND
                                                DATE '${this.secondDate}'
                                      GROUP BY EXTRACT(YEAR FROM OPER_DAY),
                                               EXTRACT(MONTH FROM OPER_DAY)
                                      UNION
                                      SELECT DATE '${this.firstDate}'
                                      FROM DUAL)
                       ${
                         curr ? (curr === '000' ? `AND CURRENCY='000'` : `AND CURRENCY!='000'`) : ''
                       }
                   GROUP BY OPER_DAY
                   ORDER BY "dat"`
    return this.chooseQuery(onlyTwo, all, month)
  }

  private creditPortfolioRateQuery = (curr: string) => {
    const onlyTwo = `SELECT OPER_DAY                                                  AS "dat",
                            ROUND(SUM(TOTAL_LOAN * CREDIT_PERCENT) / POWER(10, 6), 2) AS "sum"
                     FROM CR.VIEW_CREDITS_DWH@RISK
                     WHERE OPER_DAY = DATE '${this.firstDate}'
                       AND ${curr ? (curr === '000' ? `CURRENCY='000'` : `CURRENCY!='000'`) : '1=1'}
                     GROUP BY OPER_DAY
                     UNION
                     SELECT OPER_DAY                                                  AS "dat",
                            ROUND(SUM(TOTAL_LOAN * CREDIT_PERCENT) / POWER(10, 6), 2) AS "sum"
                     FROM CR.VIEW_CREDITS_DWH@RISK
                     WHERE OPER_DAY = DATE '${this.secondDate}'
                       AND ${curr ? (curr === '000' ? `CURRENCY='000'` : `CURRENCY!='000'`) : '1=1'}
                     GROUP BY OPER_DAY
                     ORDER BY "dat"`
    const all = `SELECT OPER_DAY                                                  AS "dat",
                        TO_CHAR(OPER_DAY, 'DD.MM.YYYY')                           AS "dateValue",
                        ROUND(SUM(TOTAL_LOAN * CREDIT_PERCENT) / POWER(10, 6), 2) AS "sum"
                 FROM CR.VIEW_CREDITS_DWH@RISK
                 WHERE OPER_DAY BETWEEN DATE '${this.firstDate}'
                     AND DATE '${this.secondDate}'
                   AND ${curr ? (curr === '000' ? `CURRENCY='000'` : `CURRENCY!='000'`) : '1=1'}
                 GROUP BY OPER_DAY
                 ORDER BY "dat"`
    const month = `SELECT OPER_DAY                                                    AS "dat",
                          TO_CHAR(TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM'), 'DD.MM.YYYY') AS "monthBegin",
                          ROUND(SUM(TOTAL_LOAN * CREDIT_PERCENT) / POWER(10, 6), 2)   AS "sum"
                   FROM CR.VIEW_CREDITS_DWH@RISK
                   WHERE OPER_DAY IN (SELECT MAX(OPER_DAY)
                                      FROM CR.VIEW_CREDITS_DWH@RISK
                                      WHERE OPER_DAY BETWEEN DATE '${this.firstDate}'
                                                AND
                                                DATE '${this.secondDate}'
                                      GROUP BY EXTRACT(YEAR FROM OPER_DAY),
                                               EXTRACT(MONTH FROM OPER_DAY)
                                      UNION
                                      SELECT DATE '${this.firstDate}'
                                      FROM DUAL) ${
                                        curr
                                          ? curr === '000'
                                            ? `AND CURRENCY='000'`
                                            : `AND CURRENCY!='000'`
                                          : ''
                                      }
                   GROUP BY OPER_DAY
                   ORDER BY "dat"`
    return this.chooseQuery(onlyTwo, all, month)
  }

  private PARQuery = (whereQuery = '1=1') => {
    const onlyTwo = `SELECT OPER_DAY                                    AS "dat",
                            ROUND(SUM(OVERDUE_SALDO) / POWER(10, 6), 2) AS "sum"
                     FROM CR.VIEW_CREDITS_DWH@RISK
                     WHERE OPER_DAY = DATE '${this.firstDate}'
                       AND ${whereQuery}
                     GROUP BY OPER_DAY
                     UNION
                     SELECT OPER_DAY                                    AS "dat",
                            ROUND(SUM(OVERDUE_SALDO) / POWER(10, 6), 2) AS "sum"
                     FROM CR.VIEW_CREDITS_DWH@RISK
                     WHERE OPER_DAY = DATE '${this.secondDate}'
                       AND ${whereQuery}
                     GROUP BY OPER_DAY
                     ORDER BY "dat"`
    const all = `SELECT OPER_DAY                                    AS "dat",
                        TO_CHAR(OPER_DAY, 'DD.MM.YYYY')             AS "dateValue",
                        ROUND(SUM(OVERDUE_SALDO) / POWER(10, 6), 2) AS "sum"
                 FROM CR.VIEW_CREDITS_DWH@RISK
                 WHERE OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE '${this.secondDate}'
                   AND ${whereQuery}
                 GROUP BY OPER_DAY
                 ORDER BY "dat"`
    const month = `SELECT OPER_DAY                                                    AS "dat",
                          TO_CHAR(TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM'), 'DD.MM.YYYY') AS "monthBegin",
                          ROUND(SUM(OVERDUE_SALDO) / POWER(10, 6), 2)                 AS "sum"
                   FROM CR.VIEW_CREDITS_DWH@RISK
                   WHERE OPER_DAY IN (SELECT MAX(OPER_DAY)
                                      FROM CR.VIEW_CREDITS_DWH@RISK --PAR
                                      WHERE OPER_DAY BETWEEN DATE '${this.firstDate}'
                                                AND
                                                DATE '${this.secondDate}'
                                      GROUP BY EXTRACT(YEAR FROM OPER_DAY), EXTRACT(MONTH FROM OPER_DAY)
                                      UNION
                                      SELECT DATE '${this.firstDate}'
                                      FROM DUAL)
                     AND ${whereQuery}
                   GROUP BY OPER_DAY
                   ORDER BY "dat"`
    return this.chooseQuery(onlyTwo, all, month)
  }

  private NPLAndToxicQuery = (whereQuery = `CREDIT_STATUS = 2`) => {
    const onlyTwo = `SELECT OPER_DAY                                 AS "dat",
                            ROUND(SUM(TOTAL_LOAN) / POWER(10, 6), 2) AS "sum"
                     FROM CR.VIEW_CREDITS_DWH@RISK
                     WHERE OPER_DAY = DATE '${this.firstDate}'
                       AND ${whereQuery}
                     GROUP BY OPER_DAY
                     UNION
                     SELECT OPER_DAY                                 AS "dat",
                            ROUND(SUM(TOTAL_LOAN) / POWER(10, 6), 2) AS "sum"
                     FROM CR.VIEW_CREDITS_DWH@RISK
                     WHERE OPER_DAY = DATE '${this.secondDate}'
                       AND ${whereQuery}
                     GROUP BY OPER_DAY`
    const all = `SELECT OPER_DAY                                 AS "dat",
                        TO_CHAR(OPER_DAY, 'DD.MM.YYYY')          AS "dateValue",
                        ROUND(SUM(TOTAL_LOAN) / POWER(10, 6), 2) AS "sum"
                 FROM CR.VIEW_CREDITS_DWH@RISK
                 WHERE OPER_DAY BETWEEN DATE '${this.firstDate}'
                     AND DATE '${this.secondDate}'
                   AND ${whereQuery}
                 GROUP BY OPER_DAY
                 ORDER BY "dat"`
    const month = `SELECT OPER_DAY                                                    AS "dat",
                          TO_CHAR(TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM'), 'DD.MM.YYYY') AS "monthBegin",
                          ROUND(SUM(TOTAL_LOAN) / POWER(10, 6), 2)                    AS "sum"
                   FROM CR.VIEW_CREDITS_DWH@RISK
                   WHERE OPER_DAY IN (SELECT MAX(OPER_DAY)
                                      FROM CR.VIEW_CREDITS_DWH@RISK
                                      WHERE OPER_DAY BETWEEN DATE '${this.firstDate}'
                                                AND
                                                DATE '${this.secondDate}'
                                      GROUP BY EXTRACT(YEAR FROM OPER_DAY),
                                               EXTRACT(MONTH FROM OPER_DAY)
                                      UNION
                                      SELECT DATE '${this.firstDate}'
                                      FROM DUAL)
                     AND ${whereQuery}
                   GROUP BY OPER_DAY
                   ORDER BY "dat"`
    return this.chooseQuery(onlyTwo, all, month)
  }

  private reserveQuery = () => {
    const onlyTwo = `SELECT OPER_DAY              AS "dat",
                            ABS(SELECTED_DATE_IN) AS "sum"
                     FROM MAININDICATORS
                     WHERE OPER_DAY IN (DATE '${this.firstDate}',
                                        DATE '${this.secondDate}')
                       AND ROLE = 'P_L_R'`
    const all = `SELECT OPER_DAY                        AS "dat",
                        TO_CHAR(OPER_DAY, 'DD.MM.YYYY') AS "dateValue",
                        ABS(SELECTED_DATE_IN)           AS "sum"
                 FROM MAININDICATORS
                 WHERE OPER_DAY BETWEEN DATE '${this.firstDate}' AND
                     DATE '${this.secondDate}'
                   AND ROLE = 'P_L_R'`
    const month = `SELECT OPER_DAY                                                    AS "dat",
                          TO_CHAR(TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM'), 'DD.MM.YYYY') AS "monthBegin",
                          ABS(SELECTED_DATE_IN)                                       AS "sum"
                   FROM MAININDICATORS
                   WHERE OPER_DAY IN (SELECT MAX(OPER_DAY)
                                      FROM MAININDICATORS
                                      WHERE OPER_DAY BETWEEN DATE '${this.firstDate}'
                                                AND
                                                DATE '${this.secondDate}'
                                      GROUP BY EXTRACT(MONTH FROM OPER_DAY),
                                               EXTRACT(YEAR FROM OPER_DAY)
                                      UNION
                                      SELECT DATE '${this.firstDate}'
                                      FROM DUAL)
                     AND ROLE = 'P_L_R'
                   ORDER BY "dat"`
    return this.chooseQuery(onlyTwo, all, month)
  }

  async credit_portfolio() {
    const data = await this.getDataInDates<IDashboardMonthlyDbData, true>(
      undefined,
      this.creditPortfolioQuery,
      true
    )
    return this.createData('1', 'Кредитный портфель', data, true)
  } /* Кредитный портфель */

  async credit_portfolio_nat_curr() {
    const data = await this.getDataInDates<IDashboardMonthlyDbData, true>(
      undefined,
      this.creditPortfolioQuery.bind(this, '000'),
      true
    )
    return this.createData('1.1', 'в том числе в нац.валюте', data, true)
  } /* в том числе в нац.валюте */

  async credit_portfolio_rate_nat_curr(creditPortfolioNatCurr: any) {
    const data = await this.getDataInDates<IDashboardMonthlyDbData, true>(
      undefined,
      this.creditPortfolioRateQuery.bind(this, '000'),
      true
    )
    const { data: creditPortfolioData } = creditPortfolioNatCurr
    const updatedData = data.map((d: any, i: number) => ({
      ...d,
      ['sum']: +(d['sum'] / creditPortfolioData[i]['sum']).toFixed(2)
    }))
    return this.createData('', '-средневзвешенные процентные ставки', updatedData, false, true)
  } /* -средневзвешенные процентные ставки */

  async credit_portfolio_for_curr() {
    const data = await this.getDataInDates<IDashboardMonthlyDbData, true>(
      undefined,
      this.creditPortfolioQuery.bind(this, 'foreign'),
      true
    )
    return this.createData('1.2', 'в том числе в иностранной валюте', data, true)
  } /* в том числе в иностранной валюте */

  async credit_portfolio_rate_for_curr(creditPortfolioForCurr: any) {
    const data = await this.getDataInDates<IDashboardMonthlyDbData, true>(
      undefined,
      this.creditPortfolioRateQuery.bind(this, 'foreign'),
      true
    )
    const { data: creditPortfolioData } = creditPortfolioForCurr
    const updatedData = data.map((d: any, i: number) => ({
      ...d,
      ['sum']: +(d['sum'] / creditPortfolioData[i]['sum']).toFixed(2)
    }))
    return this.createData('', '-средневзвешенные процентные ставки', updatedData, false, true)
  } /* -средневзвешенные процентные ставки */

  async par_30() {
    const data = await this.getDataInDates<IDashboardMonthlyDbData, true>(
      undefined,
      this.PARQuery.bind(this, `(OPER_DAY - OVERDUE_DATE) <= 30`),
      true
    )
    return this.createData('2', 'PAR<30', data, true)
  } /* PAR<30 */

  async par_60() {
    const data = await this.getDataInDates<IDashboardMonthlyDbData, true>(
      undefined,
      this.PARQuery.bind(
        this,
        `(OPER_DAY - OVERDUE_DATE) > 30 AND (OPER_DAY - OVERDUE_DATE) <= 60`
      ),
      true
    )
    return this.createData('2.1', 'PAR<60', data, true)
  } /* PAR<60 */

  async par_90() {
    const data = await this.getDataInDates<IDashboardMonthlyDbData, true>(
      undefined,
      this.PARQuery.bind(
        this,
        `(OPER_DAY - OVERDUE_DATE) > 60 AND (OPER_DAY - OVERDUE_DATE) <= 90`
      ),
      true
    )
    return this.createData('2.2', 'PAR<90', data, true)
  } /* PAR<90 */

  // TODO -средневзвешенные маржа банка

  async npl() {
    const data = await this.getDataInDates<IDashboardMonthlyDbData, true>(
      undefined,
      this.NPLAndToxicQuery.bind(this, `CREDIT_STATUS = 2`),
      true
    )
    return this.createData('3', 'NPL', data, true)
  } /* NPL */

  async toxic() {
    const data = await this.getDataInDates<IDashboardMonthlyDbData, true>(
      undefined,
      this.NPLAndToxicQuery.bind(this, `IS_TOXIC=1`),
      true
    )
    return this.createData('4', 'Реструктуризация (токсичные)', data, true)
  } /* Реструктиризация (токсичные) */

  npl_share(NPL: any, creditPortfolio: any) {
    const { data: NPLData } = NPL
    const { data: creditPortfolioData } = creditPortfolio
    const updatedData = NPLData.map((d: any, i: number) => ({
      ...d,
      ['sum']: +((d['sum'] * 100) / creditPortfolioData[i]['sum']).toFixed(2)
    }))
    return this.createData('5', 'Удельный вес NPL к портфелю', updatedData, true, true)
  } /* Уделный вес NPL к портфелю */

  async reserve() {
    const data = await this.getDataInDates<IDashboardMonthlyDbData, true>(
      undefined,
      this.reserveQuery,
      true
    )
    return this.createData('6', 'Резервы', data, true)
  } /* NPL */

  async getRows(): Promise<any[]> {
    try {
      const [
        creditPortfolio,
        creditPortfolioNatCurr,
        creditPortfolioForCurr,
        PAR30,
        PAR60,
        PAR90,
        NPLData,
        toxicData,
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
      const creditPortfolioRateNatCurr = await this.credit_portfolio_rate_nat_curr(
        creditPortfolioNatCurr
      )
      const creditPortfolioRateForCurr = await this.credit_portfolio_rate_for_curr(
        creditPortfolioForCurr
      )
      const NPLShare = this.npl_share(NPLData, creditPortfolio)
      return [
        // КАЧЕСТВО АКТИВОВ
        creditPortfolio,
        creditPortfolioNatCurr,
        creditPortfolioRateNatCurr,
        creditPortfolioForCurr,
        creditPortfolioRateForCurr,
        PAR30,
        PAR60,
        PAR90,
        NPLData,
        toxicData,
        NPLShare,
        reserveData
      ]
    } catch (e) {
      console.log(e)
      return []
    }
  }
}
