const MainClass = require("../mainClass")

class TopDepositsMainClass extends MainClass {
    constructor(date) {
        super(date)
        this.currencyCodes = ['000', '840', '978']
        this.codes = ['20200', '20600', '20400', '22602', '22613', '22614']
        this.accounts = this.codes.reduce((acc, val) => {
            acc[val] = this.currencies
                .map((currency, index) => ({
                        code_code: val,
                        currency: (val === '22614' && index === 0) ? '643' : currency}))
            return acc
        }, {})
    }

    topDepositsQuery(code_coa, currency) {
        return function (date) {
            return `SELECT
                        NAME, SALDO_OUT, PERCENT
                    FROM TOP_DEPOSITS
                    WHERE OPER_DAY=(SELECT MAX(OPER_DAY) FROM TOP_DEPOSITS WHERE OPER_DAY<TO_DATE('${date}', 'DD.MM.YYYY'))
                      AND CODE_COA='${code_coa}' AND CURRENCY_CODE='${currency}' ORDER BY PERCENT DESC`
        }
    }

    async getOneRow(code_coa, currency) {
        return await this.getDataInDates(
            '',
            false,
            this.topDepositsQuery(code_coa, currency),
            true
        )
    }

    async getRows() {
        let accountsWithData = {}
        for (const accountsKey in this.accounts) {
            accountsWithData[accountsKey] = await Promise.all(
                this.accounts[accountsKey].map(a => this.getOneRow(a.code_code, a.currency))
            )
        }
        return accountsWithData
    }
}

module.exports = TopDepositsMainClass