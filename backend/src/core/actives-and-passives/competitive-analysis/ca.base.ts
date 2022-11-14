import { Base } from '../../base'
import { IQuarterCols, IQuarterDates, RiskBalances } from './ca.interface'

export class CompetitiveAnalysis extends Base {
  private quarterDates: [string, string, string, string]

  protected formatQuery(): string {
    return `SELECT TO_CHAR(END_QUARTER, 'D mon YYYY', 'NLS_DATE_LANGUAGE = RUSSIAN') AS "quarterDates",
                   TO_CHAR(LAST_OPER_DAY_IN_QUARTER, 'YYYY-MM-DD')                   AS "date"
            FROM (SELECT MAX(OPER_DAY)                       AS LAST_OPER_DAY_IN_QUARTER,
                         ADD_MONTHS(TRUNC(OPER_DAY, 'Q'), 3) AS END_QUARTER
                  FROM IABS.DAY_OPERATIONAL@IABS
                  WHERE OPER_DAY < TRUNC(DATE '${this.date}', 'Q')
                  GROUP BY TRUNC(OPER_DAY, 'Q')
                  ORDER BY LAST_OPER_DAY_IN_QUARTER DESC FETCH FIRST 4 ROW ONLY)
            ORDER BY END_QUARTER`
  }

  private activesQuery = () => {
    return ``
  }

  private riskDataQuery = (balanceType: RiskBalances) => {
    return () => {
      return `WITH DATES AS
											 (SELECT TO_CHAR(TRUNC(OPER_DAY, 'Q'), 'YYYY-Q') AS QUARTER,
															 MAX(OPER_DAY)                           AS LAST_OPER_DAY_IN_QUARTER,
															 ADD_MONTHS(TRUNC(OPER_DAY, 'Q'), 3)     AS END_QUARTER
												FROM CR.DWH_INDICATORS@RISK
												WHERE OPER_DAY < TRUNC(DATE '${this.date}', 'Q')
												GROUP BY TRUNC(OPER_DAY, 'Q')
												ORDER BY QUARTER DESC
														FETCH FIRST 4 ROW ONLY)
							SELECT ROUND(SUM(${balanceType.toUpperCase()}) / POWER(10, 6), 2) AS "value"
							FROM DATES
											 JOIN CR.DWH_INDICATORS@RISK DWH
														ON DWH.OPER_DAY = DATES.LAST_OPER_DAY_IN_QUARTER
							GROUP BY END_QUARTER`
    }
  }

  private async getQuarterDates() {
    const quarterDates = await this.getDataInDates<IQuarterDates, true>('1=1', undefined, true)
    console.log(quarterDates)
    this.quarterDates = quarterDates.map(({ date }) => date) as typeof this.quarterDates
    return quarterDates.map(({ quarterDates }) => quarterDates.replace(/\d/, '1'))
  }

  private async risk_data(balanceType: RiskBalances) {
    return await this.getDataInDates<IQuarterCols, true>(
      undefined,
      this.riskDataQuery(balanceType),
      true
    )
  }

  async getRows() {
    const formattedQuarterDates = await this.getQuarterDates()
    const creditPortfolio = await this.risk_data('PFL_BALANCE')
    const npl = await this.risk_data('NPL_BALANCE')
    const reserve = await this.risk_data('RES_BALANCE')
    const totalData = { creditPortfolio, npl, reserve }
    return [formattedQuarterDates, totalData]
  }
}
