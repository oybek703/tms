import MainClass from '../mainClass'

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

	async quarterDates() {
		const quarterDates = await this.getDataInDates('', this.quarterDatesQuery, true)
		return quarterDates.map((date: { quarterDates: string }) =>
			date.quarterDates.replace(/\d/, '1')
		)
	}

	async getRows(): Promise<any> {
		const quarterDates = await this.quarterDates()
		return {
			quarterDates
		}
	}
}

export default CompetitiveAnalysisMainClass
