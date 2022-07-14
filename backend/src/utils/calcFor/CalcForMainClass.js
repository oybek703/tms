const MainClass = require("../mainClass")
const {formatOneDate} = require("../dateFormatter")
const {getDatesBetweenDates} = require("./calcfor_pure_functions")

class CalcForMainClass extends MainClass {
    constructor(date) {
        super(date)
    }

    startEndDateQuery() {
        return `SELECT FROM_DATE, END_DATE FROM FOR_STANDARD
                WHERE TO_DATE('${this.date}', 'DD-MM-YYYY')>=FROM_DATE
                  AND TO_DATE('${this.date}', 'DD-MM-YYYY')<=END_DATE`
    }

    async getDates() {
        const {FROM_DATE, END_DATE} = await this.getDataInDates('', false, this.startEndDateQuery.bind(this))
        return getDatesBetweenDates(FROM_DATE, END_DATE)
    }

    formatQuery(date, where_query) {
        return `SELECT
                       DATE_VALUE,
                       F_O_R,
                       NVL(CB_STANDARD, 0) CB_STANDARD,
                       NVL(ST_DEVIATION, 0) ST_DEVIATION,
                       (SELECT
                            CASE
                                WHEN ST_DEVIATION>0 THEN ROUND((ST_DEVIATION*0.135)/365, 2)
                                ELSE 0
                                END
                        FROM DUAL) AS AVG_CONSUMPTION
                FROM (SELECT
                                   DATE_VALUE,
                                   F_O_R,
                                   CB_STANDARD,
                                   (F_O_R-CB_STANDARD) ST_DEVIATION
                               FROM (SELECT
                                         '${date}' DATE_VALUE,
                                         (SELECT CB_STANDARD FROM (SELECT * FROM FOR_STANDARD ORDER BY FROM_DATE)
                                          WHERE TO_DATE('${date}', 'DD-MM-YYYY')>=FROM_DATE
                                            AND TO_DATE('${date}', 'DD-MM-YYYY')<=END_DATE AND ROWNUM=1) CB_STANDARD,
                                         (SELECT ABS(ROUND(SUM(SALDO_OUT) / POWER(10, 5), 2))
                                          FROM (SELECT AC.CODE,
                                                       (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                               SALDO_OUT
                                                        FROM IBS.SALDO@IABS SL
                                                        WHERE SL.ACCOUNT_CODE = AC.CODE
                                                          AND SL.OPER_DAY <= TO_DATE('${date}', 'DD-MM-YYYY')
                                                          AND ROWNUM = 1) AS SALDO_OUT
                                                FROM IBS.ACCOUNTS@IABS AC
                                                WHERE CODE_COA = '10301'
                                                  AND CODE_CURRENCY = '000')) F_O_R
                                     FROM DUAL))`
    }

    async getOneRow(date) {
        return await this.getDataInDates('', false, this.formatQuery.bind(this, date))
    }

    async getRows() {
        const dates = await this.getDates()
        return await Promise.all(dates.map(date => {
        if(new Date(date) <= new Date(Date.now() - 86400000)) {
            return this.getOneRow(formatOneDate(date))
        }
        return {
            DATE_VALUE: formatOneDate(date),
            F_O_R: 0,
            CB_STANDARD: 0,
            ST_DEVIATION: 0,
            AVG_CONSUMPTION: 0
        }
        }))
    }
}

module.exports = CalcForMainClass