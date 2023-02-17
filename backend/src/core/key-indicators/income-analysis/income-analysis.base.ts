import { Base } from '../../base'
import { IDate, IIncomeDbData, IIncomeQueryCodes } from './income-analysis.interface'

export class IncomeAnalysisBase extends Base {
  protected dates: string

  protected formatQuery(whereQuery: string): string {
    return whereQuery
  }

  protected getDatesQuery = () => {
    return `SELECT TO_CHAR(MAX(OPER_DAY), 'YYYY-MM-DD') AS "dat"
            FROM IBS.DAY_OPERATIONAL@IABS
            GROUP BY EXTRACT(MONTH FROM OPER_DAY), EXTRACT(YEAR FROM OPER_DAY)
            HAVING (MAX(OPER_DAY) >= ADD_MONTHS(DATE '${this.date}', -7) AND MAX(OPER_DAY) < DATE '${this.date}')
            ORDER BY MAX(OPER_DAY) DESC FETCH FIRST 7 ROWS ONLY`
  }

  protected getChartDataQuery = (whereQuery: string, dates: string) => {
    return () => {
      return `WITH BENIFIT AS
                       (SELECT DAT,
                               DECODE(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ), 0,
                                      (SELECT SUM(SALDO_EQV_OUTM + SALDO_EQV_OUTP)
                                       FROM IBS.DWH_COA_Y@IABS
                                       WHERE OPER_DAY = DAT
                                         AND ${whereQuery}),
                                      SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ)) / POWER(10, 8) AS SUM_EQV
                        FROM IBS.SVOD_SALDO_DUMP@IABS
                        WHERE ${whereQuery.replace('COA_CODE', 'BAL')}
                          AND DAT IN (${dates})
                        GROUP BY DAT)
              SELECT INITCAP(TO_CHAR(TRUNC(ADD_MONTHS(DAT, 1), 'MM'), 'month', 'NLS_DATE_LANGUAGE=RUSSIAN')) AS "monthName",
                     DECODE(EXTRACT(MONTH FROM DAT), 1, SUM_EQV, SUM_EQV - LAG(SUM_EQV) OVER (ORDER BY DAT))                     AS "saldo"
              FROM BENIFIT
              OFFSET 1 ROWS`
    }
  }

  getDates = async () => {
    const dates = await this.getDataInDates<IDate, true>(undefined, this.getDatesQuery, true)
    this.dates = dates.reduce((previousValue, currentValue, currentIndex) => {
      const { dat } = currentValue
      const isLastElement = currentIndex === dates.length - 1
      previousValue += `DATE '${dat}'${isLastElement ? '' : ', '}`
      return previousValue
    }, ``)
  }

  getChartData = async (whereQuery: string, title: string) => {
    const data = await this.getDataInDates<IIncomeDbData, true>(
      undefined,
      this.getChartDataQuery(whereQuery, this.dates),
      true
    )
    return { title, data }
  }

  getIncomes = async () => {
    //Прочие процентные доходы
    const otherPercentIncomes = await this.getChartData(
      IIncomeQueryCodes.otherPercentIncomes,
      'Прочие процентные доходы'
    )
    //По долгосрочным кредитам
    const forLongTermIncomes = await this.getChartData(
      IIncomeQueryCodes.forLongTermIncomes,
      'По долгосрочным кредитам'
    )
    //Процентный доход по ценным бумагам
    const interestIncome = await this.getChartData(
      IIncomeQueryCodes.interestIncome,
      'Процентный доход по ценным бумагам'
    )
    // По неоплаченными акцептам
    const unpaidAcceptances = await this.getChartData(
      IIncomeQueryCodes.unpaidAcceptances,
      ' По неоплаченными акцептам'
    )
    // По инвестициям
    const byInvestments = await this.getChartData(
      IIncomeQueryCodes.byInvestments,
      ' По инвестициям'
    )
    // По счётам в других банках
    const otherBanksAccounts = await this.getChartData(
      IIncomeQueryCodes.otherBanksAccounts,
      ' По счётам в других банках'
    )
    return [
      otherPercentIncomes,
      forLongTermIncomes,
      interestIncome,
      unpaidAcceptances,
      byInvestments,
      otherBanksAccounts
    ]
  }

  async getRows() {
    await this.getDates()
    // АНАЛИЗ ПРОЦЕНТНОГО ДОХОДА
    const income = await this.getIncomes()
    return [income]
  }
}

// DATE '2022-07-29',
// DATE '2022-08-31',
// DATE '2022-09-30',
// DATE '2022-10-31',
// DATE '2022-11-30',
// DATE '2022-12-30',
// DATE '2023-01-23'
// SUBSTR(BAL, 1, 3) IN ('449', '447', '450', '451')
