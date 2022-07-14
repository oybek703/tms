const MainClass = require('../mainClass')
const {createCorrespondentData} = require('./corr_pure_functions')

class CorrespondentMainClass extends MainClass {
    constructor(date) {
        super(date)
        this.currs = ['UZS', 'CNY', 'JPY', 'KZT', 'RUB', 'CHF', 'GBP', 'USD', 'EUR']
    }

    correspondentQuery(role) {
        return function (date) {
            return `SELECT UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR
                    FROM (SELECT * FROM CORRESPONDENT ORDER BY OPER_DAY DESC)
                    WHERE OPER_DAY<TO_DATE('${date}', 'DD-MM-YYYY') AND CODE_COA='${role}' AND ROWNUM=1`
        }
    }

    async getOneRow(count, state, code_coa, ownQuery, isTableHead = false, isNegative) {
        if (!code_coa) {
            const {UZS = '', CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR} = await this.getDataInDates(
                '',
                false,
                ownQuery
            )
            return createCorrespondentData(
                count, state, UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR,
                isTableHead,
                isNegative
            )
        }
        const {UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR} = await this.getDataInDates(code_coa)
        return createCorrespondentData(count, state, UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR, isTableHead)
    }
}

module.exports = CorrespondentMainClass