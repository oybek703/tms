import MainClass from '../mainClass'

type Balances = 'npl' | 'pfl' | 'res'
type RiskBalances = `${Uppercase<Balances>}_BALANCE`

/* eslint-disable camelcase */
class CompetitiveAnalysisMainClass extends MainClass {
	constructor(date: string) {
		super(date)
	}

	formatQuery(date: string, _whereQuery = '1=1') {
		return `SELECT * FROM DUAL`
	}

	quarterDatesQuery = () => {
		return `SELECT TO_CHAR(END_QUARTER, 'D mon YYYY', 'NLS_DATE_LANGUAGE = RUSSIAN') AS "quarterDates"
						FROM (SELECT MAX(OPER_DAY)                           AS LAST_OPER_DAY_IN_QUARTER,
											 ADD_MONTHS(TRUNC(OPER_DAY, 'Q'), 3)     AS END_QUARTER
								FROM IABS.DAY_OPERATIONAL@IABS
								WHERE OPER_DAY < TRUNC(TO_DATE('${this.date}', 'DD.MM.YYYY'), 'Q')
								GROUP BY TRUNC(OPER_DAY, 'Q')
								ORDER BY LAST_OPER_DAY_IN_QUARTER DESC FETCH FIRST 4 ROW ONLY)
						ORDER BY END_QUARTER`
	}

	riskDataQuery = (balanceType: RiskBalances) => {
		return () => {
			return `WITH DATES AS
                     (SELECT TO_CHAR(TRUNC(OPER_DAY, 'Q'), 'YYYY-Q') AS QUARTER,
                             MAX(OPER_DAY)                           AS LAST_OPER_DAY_IN_QUARTER,
                             ADD_MONTHS(TRUNC(OPER_DAY, 'Q'), 3)     AS END_QUARTER
                      FROM CR.DWH_INDICATORS@RISK
                      WHERE OPER_DAY < TRUNC(TO_DATE('${this.date}', 'DD.MM.YYYY'), 'Q')
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

	async quarterDates() {
		const quarterDates = await this.getDataInDates('', this.quarterDatesQuery, true)
		return quarterDates.map((date: { quarterDates: string }) =>
			date.quarterDates.replace(/\d/, '1')
		)
	}

	async risk_data(balanceType: RiskBalances) {
		return await this.getDataInDates('', this.riskDataQuery(balanceType), true)
	}

	async getRows(): Promise<any> {
		const quarterDates = await this.quarterDates()
		const creditPortfolio = await this.risk_data('PFL_BALANCE')
		const npl = await this.risk_data('NPL_BALANCE')
		const reserve = await this.risk_data('RES_BALANCE')
		return {
			quarterDates,
			totalData: [creditPortfolio, npl, reserve]
		}
	}
}

export default CompetitiveAnalysisMainClass
