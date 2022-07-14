const MainClass = require("../mainClass")
const {createLiqPointersData} = require("./liq_pure_functions")

class LiquidityMainClass extends MainClass {

    constructor(date) {
        super(date)
        this.columns = ['total', 'nat_curr', 'for_curr', 'usa_dollar', 'evro']
    }

    formatQuery(date, where_query = `code_coa like '101%'`) {
        return `SELECT TOTAL,
                       NAT_CURR,
                       ROUND((TOTAL - NAT_CURR) / (SELECT EQUIVAL
                                                   FROM IBS.S_RATE_CUR@IABS
                                                   WHERE DATE_CROSS = (SELECT MAX(DATE_CROSS)
                                                                       FROM IBS.S_RATE_CUR@IABS
                                                                       WHERE CODE = '840'
                                                                         AND DATE_CROSS < TO_DATE('${date}', 'DD.MM.YYYY'))
                                                     AND CODE = '840'), 2) AS FOR_CURR,
                       USA_DOLLAR,
                       EVRO
                FROM (SELECT (SELECT ROUND(ABS(SUM((SELECT
                                                        /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                        SALDO_EQUIVAL_OUT
                                                    FROM IBS.SALDO@IABS S
                                                    WHERE S.ACCOUNT_CODE = AC.CODE
                                                      AND OPER_DAY < TO_DATE('${date}', 'DD.MM.YYYY')
                                                      AND ROWNUM = 1))) / POWER(10, 8), 2) AS SALDO_OUT
                              FROM IBS.ACCOUNTS@IABS AC
                              WHERE ${where_query})  AS TOTAL,
                             (SELECT ROUND(ABS(SUM((SELECT
                                                        /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                        SALDO_OUT
                                                    FROM IBS.SALDO@IABS S
                                                    WHERE S.ACCOUNT_CODE = AC.CODE
                                                      AND OPER_DAY < TO_DATE('${date}', 'DD.MM.YYYY')
                                                      AND ROWNUM = 1))) / POWER(10, 8), 2 ) AS SALDO_OUT
                              FROM IBS.ACCOUNTS@IABS AC
                              WHERE ${where_query}
                                AND CODE_CURRENCY = '000') AS NAT_CURR,
                             (SELECT ROUND(ABS(SUM((SELECT
                                                        /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                        SALDO_OUT
                                                    FROM IBS.SALDO@IABS S
                                                    WHERE S.ACCOUNT_CODE = AC.CODE
                                                      AND OPER_DAY < TO_DATE('${date}', 'DD.MM.YYYY') 
                                                      AND ROWNUM = 1))) / POWER(10, 8), 2) AS SALDO_OUT
                              FROM IBS.ACCOUNTS@IABS AC
                              WHERE ${where_query}
                                AND CODE_CURRENCY = '840') AS USA_DOLLAR,
                             (SELECT ROUND(ABS(SUM((SELECT
                                                        /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                        SALDO_OUT
                                                    FROM IBS.SALDO@IABS S
                                                    WHERE S.ACCOUNT_CODE = AC.CODE
                                                      AND OPER_DAY < TO_DATE( '${date}', 'DD.MM.YYYY') 
                                                      AND ROWNUM = 1))) / POWER(10, 8), 2 ) AS SALDO_OUT
                              FROM IBS.ACCOUNTS@IABS AC
                              WHERE ${where_query}
                                AND CODE_CURRENCY = '978') AS EVRO
                      FROM DUAL)`
    }

    liquidityQuery(role) {
        return function (date) {
            return `SELECT * FROM (SELECT * FROM LIQUIDITY ORDER BY OPER_DAY DESC)
                WHERE OPER_DAY<TO_DATE('${date}', 'DD-MM-YYYY') AND ROLE='${role}' AND ROWNUM=1`
        }
    }

    async getOneRow(count, state, code_coa, ownQuery, isTableHead = false) {
        if(!code_coa) {
            const {TOTAL, NAT_CURR, FOR_CURR, USA_DOLLAR, EVRO} = await this.getDataInDates(
                '',
                false,
                ownQuery
            )
            return createLiqPointersData(count, state, TOTAL, NAT_CURR, FOR_CURR, USA_DOLLAR, EVRO, isTableHead)
        }
        const {TOTAL, NAT_CURR, FOR_CURR, USA_DOLLAR, EVRO} = await this.getDataInDates(code_coa)
        return createLiqPointersData(count, state, TOTAL, NAT_CURR, FOR_CURR, USA_DOLLAR, EVRO, isTableHead)
    }

}

module.exports = LiquidityMainClass