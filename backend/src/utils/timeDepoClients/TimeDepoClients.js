const MainClass = require("../mainClass");

class TimeDepoClients extends MainClass {
    constructor(date) {
        super(date)
    }

    formatQuery(date) {
        return `SELECT
                       FILIAL_NAME,
                       CODE_COA,
                       CLIENT_NAME,
                       TO_CHAR(DATE_BEGIN, 'DD.MM.YYYY') DATE_BEGIN,
                       TO_CHAR(DATE_END, 'DD.MM.YYYY') DATE_END,
                       CURRENCY_CODE,
                       SALDO_OUT,
                       SALDO_EQUIVALENT_OUT,
                       PERCENT
                FROM (SELECT * FROM TIME_DEPO_CLIENTS ORDER BY OPER_DAY DESC)
                WHERE OPER_DAY = (SELECT MAX(OPER_DAY) FROM TIME_DEPO_CLIENTS WHERE OPER_DAY<TO_DATE('${date}', 'DD.MM.YYYY'))`
    }

    async getRows() {
        return await this.getDataInDates(true, true, '', true)
    }
}

module.exports = TimeDepoClients