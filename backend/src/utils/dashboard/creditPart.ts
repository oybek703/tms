import DashboardMainClass from './dashboardMainClass'
import { OwnQuery } from '../mainClass'

/* eslint-disable camelcase */
class CreditPart extends DashboardMainClass {
	queries: string[]
	currencyCodes: string[]
	constructor(date: string) {
		super(date)
		// ADDED TOXIC(Токсич.) AND DELAYED(Просрочка) CREDITS
		this.queries = [`AND CREDIT_STATUS IN (0, 1, 2)`, `AND CREDIT_STATUS = 2`]
		this.currencyCodes = ['000', '840', '978']
	}

	formatQuery(date: string, whereQuery = '') {
		return `SELECT
                    TRUNC(SUM(TOTAL_LOAN)/POWER(10, 6), 2) SUM
                FROM CR.VIEW_CREDITS_DWH@RISK
                WHERE
                    OPER_DAY = TO_DATE('${date}', 'DD-MM-YYYY') ${whereQuery}`
	}

	delayedAndToxicQuery(date: string) {
		return `SELECT (DELAYED + TOXIC) SUM
                FROM ((SELECT TRUNC(SUM(TOTAL_LOAN) / POWER(10, 6), 2) TOXIC
                       FROM CR.VIEW_CREDITS_DWH@RISK
                       WHERE OPER_DAY = TO_DATE('${date}', 'DD-MM-YYYY')
                         AND CREDIT_STATUS = 1)),
                     (SELECT TRUNC(SUM(OVERDUE_SALDO) / POWER(10, 6), 2) DELAYED
                      FROM CR.VIEW_CREDITS_DWH@RISK
                      WHERE OPER_DAY = TO_DATE('${date}', 'DD-MM-YYYY'))`
	}

	disaggregatedQuery(date: string, termType: number) {
		return `SELECT
                    TRUNC(SUM(TOTAL_LOAN)/POWER(10, 6), 2) SUM
                FROM CR.VIEW_CREDITS_DWH@RISK
                WHERE
                    OPER_DAY = TO_DATE('${date}', 'DD-MM-YYYY') 
                  AND 
                    TERM_LOAN_TYPE=${termType}`
	}

	issuedCreditsQuery(date: string, codeCurrency: string) {
		const power = codeCurrency === '000' ? 9 : 10
		return `SELECT ROUND(NVL(SUM(DEBIT_EQUIVAL) / POWER(10, ${power}), 0), 2) AS SUM
                FROM CR.LOANS_ISSUED_DWH@RISK 
                WHERE OPER_DAY = (SELECT DECODE((TO_DATE('${date}', 'DD-MM-YYYY')), TRUNC(SYSDATE, 'DD'),
                              (SELECT MAX(OPER_DAY) FROM CR.LOANS_ISSUED_DWH@RISK), TO_DATE('${date}', 'DD-MM-YYYY'))
                FROM DUAL)
                  AND CODE_CURRENCY = ${codeCurrency}`
	}

	async getOneRow(whereQuery: string, ownQuery?: OwnQuery) {
		const { SUM } = await this.getDataInDates(whereQuery, ownQuery)
		return Number(SUM).toFixed(2)
	}

	async issued_credits() {
		/* Выдача кредитов */
		return await Promise.all(
			this.currencyCodes.map((c) =>
				this.getOneRow('', this.issuedCreditsQuery.bind(this, this.date, c))
			)
		)
	} /* Выдача кредитов */

	async standard_credits() {
		/* Стандартние  кредиты */
		return this.getOneRow(`AND CREDIT_STATUS=0`)
	} /* Стандартние  кредиты */

	async delayed_and_toxic() {
		/* Просрочка & Токсич. */
		return await this.getOneRow('', this.delayedAndToxicQuery)
	} /* Просрочка & Токсич. */

	async disaggregated_by_time() {
		/* В разбивке по срокам */
		return await Promise.all(
			[1, 3].map((t) => this.getOneRow('', this.disaggregatedQuery.bind(this, this.date, t)))
		)
	} /* В разбивке по срокам */

	async getRows() {
		const mappedPromises = this.queries.map((where) => this.getOneRow(where))
		const [disaggregatedByTime, issuedCredits] = await Promise.all([
			this.disaggregated_by_time(),
			this.issued_credits()
		])
		const creditPart1 = await Promise.all([
			...mappedPromises,
			this.delayed_and_toxic(),
			this.standard_credits()
		])
		return {
			creditPart1,
			disaggregatedByTime,
			issuedCredits
		}
	}
}

export default CreditPart
