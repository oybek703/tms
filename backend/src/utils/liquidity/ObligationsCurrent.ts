import Obligations from './Obligations'

class ObligationsCurrent extends Obligations {

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

    async demand_deposits() { /* Депозиты до востребования */
        return await this.getOneRow(
            '10',
            'Депозиты до востребования',
            `CODE_COA LIKE '202%'`,
            null,
            true
        )
    } /* Депозиты до востребования */

    async individuals() { /* Физические лица */
        return await this.getOneRow(
            '',
            'Физические лица',
            `CODE_COA='20206'`
        )
    } /* Физические лица */

    async other_client_deposits() { /* Другие депозиты клиентов */
        return await this.getOneRow(
            '12',
            'Другие депозиты клиентов',
            `CODE_COA LIKE '226%'`,
            null,
            true
        )
    } /* Другие депозиты клиентов */

    async funds_on_pc() { /* Средства на ПК */
        return await this.getOneRow(
            '-',
            'Средства на ПК',
            `CODE_COA IN ('22617', '22618', '22619', '22620')`
        )
    } /* Средства на ПК */

    async other_obligations() { /* Другие обязательства */
        return await this.getOneRow(
            '-',
            'Другие обязательства',
            `CODE_COA LIKE '298%'`,
            null,
            true
        )
    } /* Другие обязательства */

}

export default ObligationsCurrent