const DashboardMainClass = require('./dashboardMainClass')

class DashboardCurrencyPosition extends DashboardMainClass {
    constructor(date) {
        super(date)
        this.currencyCodes = [
            {code: '840', label: 'USD'},
            {code: '978', label: 'EUR'},
            {code: '392', label: 'JPY'},
            {code: '826', label: 'GBP'},
            {code: '398', label: 'KZT'},
            {code: '643', label: 'RUB'},
            {code: '756', label: 'CHF'},
            {code: '156', label: 'CNY'}
        ]
    }

    matchLabel(currencyCode) {
        return this.currencyCodes.find(({code}) => code === currencyCode)['label']
    }

    formatQuery(date, where_query = '840') {
        return `SELECT
                       TRUNC(EQUIVAL/POWER(10, ${where_query === '392' ? 6 : 8}), 2) EQUIVAL
                FROM (SELECT * FROM DASHBOARD_CURRENCYPOSITION ORDER BY OPER_DAY DESC)
                WHERE 
                      OPER_DAY<=TO_DATE('${date}', 'DD-MM-YYYY') 
                  AND 
                      CURRENCY_CODE=${where_query} AND ROWNUM=1`
    }

    positionQuery(date) {
        return `SELECT CURRENCY_CODE,
                       DECODE(CURRENCY_CODE, '392', CP.EQUIVAL, CP.EQUIVAL / 100) EQUIVAL,
                       DECODE(CURRENCY_CODE, '392', RATE.EQUIVAL * CP.EQUIVAL, RATE.EQUIVAL * CP.EQUIVAL / 100) AS SUM_EQUIVAL,
                       TRUNC(RATE.EQUIVAL * CP.EQUIVAL / (SELECT EQUIVAL
                                                          FROM   REGULATORYCAPITAL
                                                          WHERE  OPER_DAY = (SELECT
                                                                                 MAX(OPER_DAY)
                                                                             FROM
                                                                                 IBS.DAY_OPERATIONAL@IABS
                                                                             WHERE
                                                                                     OPER_DAY < TO_DATE('${date}', 'DD.MM.YYYY'))
                                                            AND ROLE = 'R_C'), 3) PERCENT
                FROM   DASHBOARD_CURRENCYPOSITION CP
                           JOIN IBS.S_RATE_CUR@IABS RATE
                                ON RATE.DATE_CROSS = CP.OPER_DAY
                WHERE  RATE.CODE = CP.CURRENCY_CODE
                  AND OPER_DAY = TO_DATE('${date}', 'DD.MM.YYYY')`
    }

    async getOneRow(where_query) {
        const {EQUIVAL} = await this.getDataInDates(where_query, true)
        return Number(EQUIVAL || 0).toFixed(2)
    }

    async getRows() {
        const position = (await this.getDataInDates(
            false,
            false,
            this.positionQuery,
            true
        )).map(p => ({...p, NAME: this.matchLabel(p['CURRENCY_CODE'])}))
        const currencyPosition = await Promise.all(
            this.currencyCodes
                .map(({code}) => this.getOneRow(code))
        )
        return {currencyPosition, position}
    }
}

module.exports = DashboardCurrencyPosition