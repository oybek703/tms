import MainClass, { OwnQuery } from '../mainClass'
import { createCorrespondentData } from './corr_pure_functions'

class CorrespondentMainClass extends MainClass {
    currencyNames: string[]

    constructor(date: string) {
        super(date)
        this.currencyNames = ['UZS', 'CNY', 'JPY', 'KZT', 'RUB', 'CHF', 'GBP', 'USD', 'EUR']
    }

    correspondentQuery(role: string) {
        return function (date: Date) {
            return `SELECT UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR
                    FROM (SELECT * FROM CORRESPONDENT ORDER BY OPER_DAY DESC)
                    WHERE OPER_DAY<TO_DATE('${date}', 'DD-MM-YYYY') AND CODE_COA='${role}' AND ROWNUM=1`
        }
    }

    async getOneRow(count: string, state: string, codeCoa: string, ownQuery?: OwnQuery, isTableHead: boolean = false, isNegative?: boolean) {
        if (!Boolean(codeCoa)) {
            const {UZS = '', CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR} = await this.getDataInDates(
                '',
                ownQuery
            )
            return createCorrespondentData(
                count, state, UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR,
                isTableHead,
                isNegative
            )
        }
        const {UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR} = await this.getDataInDates(codeCoa)
        return createCorrespondentData(count, state, UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR, isTableHead)
    }
}

export default CorrespondentMainClass