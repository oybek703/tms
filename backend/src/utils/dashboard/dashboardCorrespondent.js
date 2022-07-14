const DashboardMainClass = require("./dashboardMainClass")

class DashboardCorrespondent extends DashboardMainClass {
    constructor(date) {
        super(date)
        this.terms = [
            {code: '000', image: 'uzs'},
            {code: '840', image: 'usd'},
            {code: '978', image: 'eur'},
            {code: '643', image: 'rub'}
        ]
    }

    formatQuery(date, where_query) {
        return `SELECT
                    EQUIVAL, DIFFRENCE
                FROM (SELECT * FROM DASHBOARD_CORRESPONDENT ORDER BY OPER_DAY DESC)
                WHERE
                    CURRENCY_CODE=${where_query}
                  AND
                    OPER_DAY<=TO_DATE('${date}', 'DD-MM-YYYY') AND ROWNUM=1`
    }

    async getOneRow(where_query, image) {
        const {EQUIVAL, DIFFRENCE} = await this.getDataInDates(where_query, true)
        return {
            value: Number(EQUIVAL || 0).toFixed(2),
            differ: Number(DIFFRENCE || 0).toFixed(2),
            image
        }
    }

    async getRows() {
        const termsData = this.terms
            .map(({code, image}) => this.getOneRow(code, image))
        return await Promise.all(termsData)
    }
}

module.exports = DashboardCorrespondent