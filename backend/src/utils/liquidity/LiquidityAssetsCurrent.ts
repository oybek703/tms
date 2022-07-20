import LiquidityAssets from './LiquidityAssets'

class LiquidityAssetsCurrent extends LiquidityAssets {

    constructor (date?: string) {
        super('')
    }

    formatQuery(date: string, where_query = `CODE_COA LIKE '101%'`) {
        return `SELECT ABS((NVL(UZS_SE, 0) + NVL(EUR_SE, 0) + NVL(USD_SE, 0) + NVL(RUB_SE, 0) + NVL(JPY_SE, 0) + NVL(KZT_SE, 0) +
                            NVL(GBP_SE, 0) + NVL(CHF_SE, 0) + NVL(CHN_SE, 0)))              AS TOTAL,
                       ABS(UZS) NAT_CURR,
                       ABS(ROUND((NVL(USD_SE, 0) + NVL(EUR_SE, 0) + NVL(RUB_SE, 0) + NVL(JPY_SE, 0) + NVL(KZT_SE, 0) + NVL(GBP_SE, 0) +
                                  NVL(CHF_SE, 0) + NVL(CHN_SE, 0)) /
                                 (SELECT EQUIVAL
                                     FROM IBS.S_RATE_CUR@IABS
                                     WHERE CODE = '840'
                                     ORDER BY DATE_CROSS DESC FETCH FIRST 1 ROWS ONLY), 2)) AS FOR_CURR,
                       ABS(NVL(USD, 0))                                                     AS USA_DOLLAR,
                       ABS(NVL(EUR, 0))                                                     AS EVRO
                FROM (
                    SELECT CODE_CURRENCY,
                           ROUND(SUM(SALDO_OUT) / POWER(10, 8), 2)         AS SALDO_OUT,
                           ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2) AS SALDO_EQUIVAL_OUT
                    FROM IBS.ACCOUNTS@IABS
                    WHERE ${where_query}
                    GROUP BY CODE_CURRENCY)
                    PIVOT ( SUM(NVL(SALDO_OUT, 0)), SUM(NVL(SALDO_EQUIVAL_OUT, 0)) AS SE FOR CODE_CURRENCY IN ('000' AS UZS,
                        '840' AS USD,
                        '978' AS EUR,
                        '643' AS RUB,
                        '392' AS JPY,
                        '398' AS KZT,
                        '826' AS GBP,
                        '756' AS CHF,
                        '156' AS CHN) )`
    }

    localBanksQuery() {
        return `SELECT (SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2)
                        FROM IBS.ACCOUNTS@IABS AC
                                 JOIN BANK_DICTIONARY BD
                                      ON AC.CLIENT_CODE = CONCAT('000', BD.CLIENT_CODE)
                        WHERE AC.CODE_COA = '21002')           AS TOTAL,
                       (SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2)
                        FROM IBS.ACCOUNTS@IABS AC
                                 JOIN BANK_DICTIONARY BD
                                      ON AC.CLIENT_CODE = CONCAT('000', BD.CLIENT_CODE)
                        WHERE AC.CODE_COA = '21002'
                          AND CODE_CURRENCY = '000')           AS NAT_CURR,
                       (SELECT ROUND(FOR_CURR_SUM / (POWER(10, 8) * (SELECT EQUIVAL
                                                                     FROM IBS.S_RATE_CUR@IABS
                                                                     WHERE CODE = '840'
                                                                     ORDER BY DATE_CROSS DESC FETCH FIRST 1 ROWS ONLY)),
                                     2)
                        FROM ((SELECT SUM(SALDO_EQUIVAL_OUT) AS FOR_CURR_SUM
                               FROM IBS.ACCOUNTS@IABS AC
                                        JOIN BANK_DICTIONARY BD
                                             ON AC.CLIENT_CODE = CONCAT('000', BD.CLIENT_CODE)
                               WHERE AC.CODE_COA = '21002'
                                 AND CODE_CURRENCY <> '000'))) AS FOR_CURR,
                       (SELECT ROUND(SUM(SALDO_OUT) / POWER(10, 8), 2)
                        FROM IBS.ACCOUNTS@IABS AC
                                 JOIN BANK_DICTIONARY BD
                                      ON AC.CLIENT_CODE = CONCAT('000', BD.CLIENT_CODE)
                        WHERE AC.CODE_COA = '21002'
                          AND CODE_CURRENCY = '840')           AS USD,
                       (SELECT ROUND(SUM(SALDO_OUT) / POWER(10, 8), 2)
                        FROM IBS.ACCOUNTS@IABS AC
                                 JOIN BANK_DICTIONARY BD
                                      ON AC.CLIENT_CODE = CONCAT('000', BD.CLIENT_CODE)
                        WHERE AC.CODE_COA = '21002'
                          AND CODE_CURRENCY = '978')           AS EVRO
                FROM DUAL`
    }

    async total_actives() { /* Всего активы (чистые) */
        return await this.getOneRow(
            '',
            'Всего активы (чистые)',
            `CODE_COA LIKE '1%'
                     AND CODE_COA NOT LIKE '161%'
                     AND CODE_COA NOT LIKE '175%'`,
            null,
            true
        )
    } /* Всего активы (чистые) */

    async government_bills() { /* Гос . ценные бумаги */
        return await this.getOneRow(
            '2',
            'Гос . ценные бумаги',
            `CODE_COA LIKE '107%' AND CODE_COA != '10793'`,
            null,
            true
        )
    } /* Гос . ценные бумаги */

}

export default LiquidityAssetsCurrent