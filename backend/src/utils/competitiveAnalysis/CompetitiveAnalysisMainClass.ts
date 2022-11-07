import MainClass from '../mainClass'

type Balances = 'npl' | 'pfl' | 'res'
type RiskBalances = `${Uppercase<Balances>}_BALANCE`

/* eslint-disable camelcase */
class CompetitiveAnalysisMainClass extends MainClass {
	quarterDates: [string, string, string, string]
	constructor(date: string) {
		super(date)
	}

	formatQuery(date: string, _whereQuery = '1=1') {
		return `SELECT * FROM DUAL`
	}

	getQuarterDatesQuery = () => {
		return `SELECT TO_CHAR(END_QUARTER, 'D mon YYYY', 'NLS_DATE_LANGUAGE = RUSSIAN') AS "quarterDates",
                   TO_CHAR(LAST_OPER_DAY_IN_QUARTER, 'DD.MM.YYYY')                   AS "date"
            FROM (SELECT MAX(OPER_DAY)                       AS LAST_OPER_DAY_IN_QUARTER,
                         ADD_MONTHS(TRUNC(OPER_DAY, 'Q'), 3) AS END_QUARTER
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

	tempQuery = () => {
		const [firstDate, secondDate, thirdDate, fourthDate] = this.quarterDates
		return `select dat,
									 round(abs(sum(saldo_active_eq + saldo_passive_eq) / power(10, 8)), 2) as saldo_equival_out
						from ibs.svod_saldo_dump@iabs
						where dat in (to_date('${firstDate}', 'dd.mm.yyyy'), 
						              to_date('${secondDate}', 'dd.mm.yyyy'), 
						              to_date('${thirdDate}', 'dd.mm.yyyy'), 
						              to_date('${fourthDate}', 'dd.mm.yyyy'))
							and ((bal like '2%' and bal not like '222%') or bal like '175%')
						group by dat`
	}

	async getQuarterDates() {
		const quarterDates = await this.getDataInDates('', this.getQuarterDatesQuery, true)
		this.quarterDates = quarterDates.map(({ date }: { date: string }) => date)
		return quarterDates.map((date: { quarterDates: string }) =>
			date.quarterDates.replace(/\d/, '1')
		)
	}

	async risk_data(balanceType: RiskBalances) {
		return await this.getDataInDates('', this.riskDataQuery(balanceType), true)
	}

	async getTempData() {
		return this.getDataInDates('', this.tempQuery, true)
	}

	async getRows(): Promise<any> {
		const formattedQuarterDates = await this.getQuarterDates()
		const creditPortfolio = await this.risk_data('PFL_BALANCE')
		const npl = await this.risk_data('NPL_BALANCE')
		const reserve = await this.risk_data('RES_BALANCE')
		const tempData = await this.getTempData()
		console.log(tempData)
		return {
			quarterDates: formattedQuarterDates,
			totalData: [creditPortfolio, npl, reserve]
		}
	}
}

export default CompetitiveAnalysisMainClass
