const DashboardMainClass = require('./dashboardMainClass')

class CreditPart extends DashboardMainClass {
    constructor(date) {
        super(date)
        // ADDED TOXIC(Токсич.) AND DELAYED(Просрочка) CREDITS
        this.queries = [`AND CREDIT_STATUS IN (0, 1, 2)`, `AND CREDIT_STATUS = 2`]
        this.currencyNames = ['000', '840', '978']
    }

    formatQuery(date, where_query = '') {
        return `SELECT
                    TRUNC(SUM(TOTAL_LOAN)/POWER(10, 6), 2) SUM
                FROM CR.VIEW_CREDITS_DWH
                WHERE
                    OPER_DAY = TO_DATE('${date}', 'DD-MM-YYYY') ${where_query}`
    }

    delayedAndToxicQuery(date) {
        return `SELECT (DELAYED + TOXIC) SUM
                FROM ((SELECT TRUNC(SUM(TOTAL_LOAN) / POWER(10, 6), 2) TOXIC
                       FROM CR.VIEW_CREDITS_DWH
                       WHERE OPER_DAY = TO_DATE('${date}', 'DD-MM-YYYY')
                         AND CREDIT_STATUS = 1)),
                     (SELECT TRUNC(SUM(OVERDUE_SALDO) / POWER(10, 6), 2) DELAYED
                      FROM CR.VIEW_CREDITS_DWH
                      WHERE OPER_DAY = TO_DATE('${date}', 'DD-MM-YYYY'))`
    }

    disaggregatedQuery(date, term_type) {
        return `SELECT
                    TRUNC(SUM(TOTAL_LOAN)/POWER(10, 6), 2) SUM
                FROM CR.VIEW_CREDITS_DWH
                WHERE
                    OPER_DAY = TO_DATE('${date}', 'DD-MM-YYYY') 
                  AND 
                    TERM_LOAN_TYPE=${term_type}`
    }

    issuedCreditsQuery(date, code_currency) {
        const power = code_currency === '000' ? 9 : 10
        return `SELECT ROUND(NVL(SUM(DEBIT_EQUIVAL) / POWER(10, ${power}), 0), 2) AS SUM
                FROM CR.LOANS_ISSUED_DWH 
                WHERE OPER_DAY = (SELECT DECODE((TO_DATE('${date}', 'DD-MM-YYYY')), TRUNC(SYSDATE, 'DD'),
                              (SELECT MAX(OPER_DAY) FROM CR.LOANS_ISSUED_DWH), TO_DATE('${date}', 'DD-MM-YYYY'))
                FROM DUAL)
                  AND CODE_CURRENCY = ${code_currency}`
    }

    async getOneRow(where_query, isWhere = true, ownQuery) {
        const {SUM} = await this.getDataInDates(where_query, isWhere, ownQuery)
        return Number(SUM).toFixed(2)
    }

    async issued_credits() { /* Выдача кредитов */
        return await Promise.all(this.currencies
            .map(c => this.getOneRow('', false, this.issuedCreditsQuery.bind(this, this.date, c))))
    } /* Выдача кредитов */

    async standard_credits() { /* Стандартние  кредиты */
        return this.getOneRow(`AND CREDIT_STATUS=0`)
    } /* Стандартние  кредиты */

    async delayed_and_toxic() { /* Просрочка & Токсич. */
        return await this.getOneRow(
            '',
            false,
            this.delayedAndToxicQuery
        )
    } /* Просрочка & Токсич. */

    async disaggregated_by_time() { /* В разбивке по срокам */
        return await Promise.all([1, 3]
            .map(t => this.getOneRow(
                '',
                false,
                this.disaggregatedQuery.bind(this, this.date, t)
            )))
    } /* В разбивке по срокам */

    async getRows() {
        const mappedPromises = this.queries
            .map((where) => this.getOneRow(where))
        const [
            disaggregatedByTime,
            issuedCredits
        ] = await Promise.all([
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

module.exports = CreditPart