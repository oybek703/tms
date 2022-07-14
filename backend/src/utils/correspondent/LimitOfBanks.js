const MainClass = require('../mainClass')

class LimitOfBanks extends MainClass {

    formatQuery(date, where_query) {
        return `SELECT RESULT.NAME,
                       RESULT.UZS,
                       LB.UZS                          AS LIMIT_UZS,
                       ROUND((LB.UZS - RESULT.UZS), 2) AS DIFFER_UZS,
                       RESULT.CNY,
                       LB.CNY                          AS LIMIT_CNY,
                       ROUND((LB.CNY - RESULT.CNY), 2) AS DIFFER_CNY,
                       RESULT.JPY,
                       LB.JPY                          AS LIMIT_JPY,
                       ROUND((LB.JPY - RESULT.JPY), 2) AS DIFFER_JPY,
                       RESULT.KZT,
                       LB.KZT                          AS LIMIT_KZT,
                       ROUND((LB.KZT - RESULT.KZT), 2) AS DIFFER_KZT,
                       RESULT.RUB,
                       LB.RUB                          AS LIMIT_RUB,
                       ROUND((LB.RUB - RESULT.RUB), 2) AS DIFFER_RUB,
                       RESULT.CHF,
                       LB.CHF                          AS LIMIT_CHF,
                       ROUND((LB.CHF - RESULT.CHF), 2) AS DIFFER_CHF,
                       RESULT.GBP,
                       LB.GBP                          AS LIMIT_GBP,
                       ROUND((LB.GBP - RESULT.GBP), 2) AS DIFFER_GBP,
                       RESULT.USD,
                       LB.USD                          AS LIMIT_USD,
                       ROUND((LB.USD - RESULT.USD), 2) AS DIFFER_USD,
                       RESULT.EUR,
                       LB.EUR                          AS LIMIT_EUR,
                       ROUND((LB.EUR - RESULT.EUR), 2) AS DIFFER_EUR
                FROM (
                         SELECT CONCAT(SUBSTR(REPLACE(NAME, 'ТОШКЕНТ Ш.,', ''), 0, 44), '.') NAME,
                                CLIENT_CODE,
                                NVL(ROUND(ABS(UZS) / POWER(10, 2), 2), 0) AS                 UZS,
                                NVL(ROUND(ABS(CNY) / POWER(10, 2), 2), 0) AS                 CNY,
                                NVL(ROUND(ABS(JPY), 2), 0)                AS                 JPY,
                                NVL(ROUND(ABS(KZT) / POWER(10, 2), 2), 0) AS                 KZT,
                                NVL(ROUND(ABS(RUB) / POWER(10, 2), 2), 0) AS                 RUB,
                                NVL(ROUND(ABS(CHF) / POWER(10, 2), 2), 0) AS                 CHF,
                                NVL(ROUND(ABS(GBP) / POWER(10, 2), 2), 0) AS                 GBP,
                                NVL(ROUND(ABS(USD) / POWER(10, 2), 2), 0) AS                 USD,
                                NVL(ROUND(ABS(EUR) / POWER(10, 2), 2), 0) AS                 EUR
                         FROM (
                             SELECT CC.NAME,
                                    CC.CODE AS CLIENT_CODE,
                                    AC.SALDO_OUT,
                                    AC.CODE_CURRENCY
                             FROM IBS.ACCOUNTS@IABS AC,
                                  IBS.CLIENT_CURRENT@IABS CC
                             WHERE AC.CODE_COA IN ('10501',
                                                   '10521',
                                                   '10531',
                                                   '10541')
                               AND AC.CONDITION = 'A'
                               AND CC.CODE = SUBSTR(AC.CODE, 17, 8)) PIVOT (SUM(SALDO_OUT) FOR CODE_CURRENCY IN ('000' AS UZS,
                             '840' AS USD,
                             '826' AS GBP,
                             '643' AS RUB,
                             '756' AS CHF,
                             '978' AS EUR,
                             '392' AS JPY,
                             '156' AS CNY,
                             '398' AS KZT))) RESULT,
                     LIMIT_OF_BANKS LB
                WHERE LB.CLIENT_CODE = RESULT.CLIENT_CODE`
    }

    getPeriodQuery() {
        return `SELECT
                    UNIQUE TO_CHAR(DATE_BEGIN, 'DD.MM.YYYY') DATE_BEGIN,
                           TO_CHAR(DATE_END, 'DD.MM.YYYY') DATE_END
                FROM LIMIT_OF_BANKS`
    }

    async getPeriod() {
        return await this.getDataInDates(false, false, this.getPeriodQuery)
    }

    async getRows() {
        const period = await this.getPeriod()
        const data = await this.getDataInDates(
            true,
            true,
            false,
            true
        )
        return {data, period}
    }
}

module.exports = LimitOfBanks