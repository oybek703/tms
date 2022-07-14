const MainClass = require("../mainClass")
const {createMainIndicatorsData} = require("./mi_pure_functions")

class MainIndicatorsMainClass extends MainClass {

    constructor(date) {
        super(date)
    }

    formatQuery(date, where_query) {
        const {monthFirstDate, yearFirstDate} = this.dates
        return `SELECT year_begin,
                       month_begin,
                       selected_date,
                       ( selected_date - month_begin ) AS differ,
                       ( ROUND(( selected_date / month_begin ) - 1, 3) * 100 ) AS differ_percent
                FROM   (SELECT (SELECT ABS(ROUND(SUM(saldo_equival_out) / POWER(10, 11), 1))
                                FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                       saldo_equival_out
                                                FROM   ibs.saldo@iabs sl
                                                WHERE  sl.account_code = ac.code
                                                  AND sl.oper_day < TO_DATE('${this.date}',
                                                                            'DD-MM-YYYY')
                                                  AND ROWNUM = 1) AS saldo_equival_out
                                        FROM   ibs.accounts@iabs AC
                                        WHERE  ${where_query})) AS selected_date,
                               (SELECT ABS(ROUND(SUM(saldo_equival_out) / POWER(10, 11), 1))
                                FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                       saldo_equival_out
                                                FROM   ibs.saldo@iabs sl
                                                WHERE  sl.account_code = ac.code
                                                  AND sl.oper_day < TO_DATE('${monthFirstDate}', 'DD.MM.YYYY')
                                                  AND ROWNUM = 1) AS saldo_equival_out
                                        FROM   ibs.accounts@iabs AC
                                        WHERE  ${where_query})) AS month_begin,
                               (SELECT ABS(ROUND(SUM(saldo_equival_out) / POWER(10, 11), 1))
                                FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                       saldo_equival_out
                                                FROM   ibs.saldo@iabs sl
                                                WHERE  sl.account_code = ac.code
                                                  AND sl.oper_day < TO_DATE('${yearFirstDate}', 'DD.MM.YYYY')
                                                  AND ROWNUM = 1) AS saldo_equival_out
                                        FROM   ibs.accounts@iabs AC
                                        WHERE  ${where_query})) AS year_begin
                        FROM   dual)`
    }

    mainIndicatorsQuery(role) {
        return function (date) {
            return `SELECT 
                           YEAR_BEGIN, 
                           MONTH_BEGIN, 
                           SELECTED_DATE, 
                           DIFFER, 
                           DIFFER_PERCENT 
                    FROM (SELECT * FROM MAININDICATORS ORDER BY OPER_DAY DESC) 
                    WHERE OPER_DAY<TO_DATE('${date}', 'DD-MM-YYYY') AND ROLE='${role}' AND ROWNUM=1`
        }
    }

    async getOneRow(count, indicator_name, code_coa, ownQuery, isTableHead = false) {
        if(!code_coa) {
            const {YEAR_BEGIN, MONTH_BEGIN, SELECTED_DATE, DIFFER, DIFFER_PERCENT} = await this.getDataInDates(
                '',
                false,
                ownQuery
            )
            return createMainIndicatorsData(count, indicator_name, YEAR_BEGIN, MONTH_BEGIN, SELECTED_DATE, DIFFER, DIFFER_PERCENT, isTableHead)
        }
        const {YEAR_BEGIN, MONTH_BEGIN, SELECTED_DATE, DIFFER, DIFFER_PERCENT} = await this.getDataInDates(code_coa)
        return createMainIndicatorsData(count, indicator_name, YEAR_BEGIN, MONTH_BEGIN, SELECTED_DATE, DIFFER, DIFFER_PERCENT, isTableHead)
    }
}

module.exports = MainIndicatorsMainClass