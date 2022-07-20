import TotalCash from './TotalCash'
import { corr_include } from './corr_pure_functions'

class TotalCashCurrent extends TotalCash {

    constructor (date?: string) {
        super('')
    }

    formatQuery (date: string, where_query = `CODE_COA = '10301'`) {
        return `SELECT ROUND((SELECT ABS(SUM(SALDO_OUT))
                              from IBS.ACCOUNTS@IABS
                              WHERE ${where_query}
                                AND CODE_CURRENCY = '000') / POWER(10, 8), 2) AS UZS,
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${where_query}
                                    AND CODE_CURRENCY = '156'), 0) / POWER(10, 8), 2) AS CNY,
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${where_query}
                                    AND CODE_CURRENCY = '392'), 0) / POWER(10, 8), 2) AS JPY,
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${where_query}
                                    AND CODE_CURRENCY = '398'), 0) / POWER(10, 8), 2) AS KZT,
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${where_query}
                                    AND CODE_CURRENCY = '643'), 0) / POWER(10, 8), 2) AS RUB,
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${where_query}
                                    AND CODE_CURRENCY = '756'), 0) / POWER(10, 8), 2) AS CHF,
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${where_query}
                                    AND CODE_CURRENCY = '826'), 0) / POWER(10, 8), 2) AS GBP,
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${where_query}
                                    AND CODE_CURRENCY = '840'), 0) / POWER(10, 8), 2) AS USD,
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${where_query}
                                    AND CODE_CURRENCY = '978'), 0) / POWER(10, 8), 2) AS EUR
                FROM   dual`
    }

    corrAccountsWithOtherBanksQuery () {
        return `SELECT NAME,
                       NVL(ROUND(ABS(UZS) / POWER(10, 8), 2), 0) AS UZS,
                       NVL(ROUND(ABS(CNY) / POWER(10, 6), 2), 0) AS CNY,
                       NVL(ROUND(ABS(JPY) / POWER(10, 6), 2), 0) AS JPY,
                       NVL(ROUND(ABS(KZT) / POWER(10, 8), 2), 0) AS KZT,
                       NVL(ROUND(ABS(RUB) / POWER(10, 8), 2), 0) AS RUB,
                       NVL(ROUND(ABS(CHF) / POWER(10, 8), 2), 0) AS CHF,
                       NVL(ROUND(ABS(GBP) / POWER(10, 8), 2), 0) AS GBP,
                       NVL(ROUND(ABS(USD) / POWER(10, 8), 2), 0) AS USD,
                       NVL(ROUND(ABS(EUR) / POWER(10, 8), 2), 0) AS EUR
                FROM (
                    SELECT CC.NAME,
                           AC.SALDO_OUT,
                           AC.CODE_CURRENCY
                    FROM ibs.ACCOUNTS@IABS AC,
                         ibs.CLIENT_CURRENT@IABS CC
                    WHERE AC.CODE_COA = '10501'
                      AND AC.SALDO_OUT <> 0
                      AND CC.CODE = SUBSTR(AC.CODE, 17, 8)) PIVOT ( SUM(SALDO_OUT) FOR CODE_CURRENCY IN ('000' AS UZS,
                    '840' AS USD,
                    '826' AS GBP,
                    '643' AS RUB,
                    '756' AS CHF,
                    '978' AS EUR,
                    '392' AS JPY,
                    '156' AS CNY,
                    '398' AS KZT) )`
    }

    async total_cash_on_hand () { /* Всего денежные наличности в кассе */
        return await this.getOneRow(
            '1',
            'Всего денежная наличность в кассе',
            `CODE_COA LIKE '101%'`,
            null,
            true
        )
    } /* Всего денежные наличности в кассе */

    async cash_on_road () { /* Денежная наличность в обменных пунктах, банкоматах и деньги в пути */
        return await this.getOneRow(
            '1.2',
            'Денежная наличность в обменных пунктах, банкоматах и деньги в пути',
            `CODE_COA IN ('10103', '10107', '10111', '10109')`,
            null
        )
    } /* Денежная наличность в обменных пунктах, банкоматах и деньги в пути */

    async nostro () { /* Ностро */
        return await this.getOneRow(
            '-',
            'Ностро',
            `CODE_COA = '10301'`,
            null
        )
    } /* Ностро */

    async f_o_r () { /* ФОР */
        return await this.getOneRow(
            '-',
            'ФОР',
            `CODE_COA = '10309'`,
            null
        )
    } /* ФОР */

    async corr_accounts_with_other_banks () {
        return (await this.getDataInDates(
            '',
            this.corrAccountsWithOtherBanksQuery,
            true
        )).map((b: { NAME?: string }) => ({
            ...b,
            count: '-',
            state: b['NAME']
        }))
    }

    async getRows () {
        const [
            totalCashOnHand,
            cashOnRoad,
            nostro,
            F_O_R,
            corrAccountsWithOtherBanks
        ] = await Promise.all([
            this.total_cash_on_hand(),
            this.cash_on_road(),
            this.nostro(),
            this.f_o_r(),
            this.corr_accounts_with_other_banks()
        ])
        const cashAtCheckout = this.cash_at_checkout(totalCashOnHand, cashOnRoad)
        const obNostro = this.ob_nostro(...corrAccountsWithOtherBanks)
        const totalCorrespondentAccounts = this.total_correspondent_accounts(
            nostro, obNostro)
        const corresAccountsInCB = this.corres_accounts_inCB()
        const corresAccountsInOB = this.corres_accounts_inOB()
        return [
            [totalCashOnHand, totalCorrespondentAccounts],
            [
                totalCashOnHand,
                cashAtCheckout,
                cashOnRoad,
                totalCorrespondentAccounts,
                corresAccountsInCB,
                nostro,
                F_O_R,
                corresAccountsInOB,
                obNostro,
                corr_include(true),
                ...corrAccountsWithOtherBanks
            ]
        ]
    }
}

export default TotalCashCurrent