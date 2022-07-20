import CorrespondentInterbankDeposits from './CorrespondentInterbankDeposits'
import { getCorrespondentTotal } from './corr_pure_functions'

class CorrespondentInterbankDepositsCurrent extends CorrespondentInterbankDeposits {

    constructor (date?: string) {
        super('')
    }

    innerBanksQuery() {
        return `SELECT
                    CONCAT(SUBSTR(REPLACE(NAME, 'ТОШКЕНТ Ш.,', ''), 0, 44), '.') NAME,
                    NVL(ROUND(ABS(UZS) / POWER(10, 8), 2), 0) AS UZS,
                    NVL(ROUND(ABS(CNY) / POWER(10, 6), 2), 0) AS CNY,
                    NVL(ROUND(ABS(JPY) / POWER(10, 6), 2), 0) AS JPY,
                    NVL(ROUND(ABS(KZT) / POWER(10, 8), 2), 0) AS KZT,
                    NVL(ROUND(ABS(RUB) / POWER(10, 8), 2), 0) AS RUB,
                    NVL(ROUND(ABS(CHF) / POWER(10, 8), 2), 0) AS CHF,
                    NVL(ROUND(ABS(GBP) / POWER(10, 8), 2), 0) AS GBP,
                    NVL(ROUND(ABS(USD) / POWER(10, 8), 2), 0) AS USD,
                    NVL(ROUND(ABS(EUR) / POWER(10, 8), 2), 0) AS EUR
                FROM (SELECT CC.NAME,
                             AC.SALDO_OUT,
                             AC.CODE_CURRENCY
                      FROM IBS.ACCOUNTS@IABS AC,
                           IBS.CLIENT_CURRENT@IABS CC
                      WHERE AC.CODE_COA IN ('10597', '10521', '10531', '10541')
                        AND AC.SALDO_OUT <> 0
                        AND CC.CODE = SUBSTR(AC.CODE, 17, 8)) PIVOT (SUM(SALDO_OUT) FOR CODE_CURRENCY IN ('000' AS UZS,
                    '840' AS USD,
                    '826' AS GBP,
                    '643' AS RUB,
                    '756' AS CHF,
                    '978' AS EUR,
                    '392' AS JPY,
                    '156' AS CNY,
                    '398' AS KZT))`
    }

    formatQuery(date: string, whereQuery = '') {
        return `SELECT ROUND((SELECT ABS(SUM(SALDO_OUT))
                              from IBS.ACCOUNTS@IABS
                              WHERE ${whereQuery}
                                AND CODE_CURRENCY = '000') / POWER(10, 8), 2) AS UZS,
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '156'), 0) / POWER(10, 8), 2) AS CNY,
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '392'), 0) / POWER(10, 8), 2) AS JPY,
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '398'), 0) / POWER(10, 8), 2) AS KZT,
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '643'), 0) / POWER(10, 8), 2) AS RUB,
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '756'), 0) / POWER(10, 8), 2) AS CHF,
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '826'), 0) / POWER(10, 8), 2) AS GBP,
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '840'), 0) / POWER(10, 8), 2) AS USD,
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '978'), 0) / POWER(10, 8), 2) AS EUR
                FROM   dual`
    }

    liq_assets_total(...args: any) { /* Всего ликвидные средства */
        const [UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR] = this.currencyNames
            .map(c => getCorrespondentTotal(c, ...args))
        return {
            count: '-',
            state: 'Всего ликвидные средства',
            UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR,
            isTableHead: true
        }
    } /* Всего ликвидные средства */

    async accounts_settlement() { /* Расчеты с клиентами - 29801 */
        return await this.getOneRow(
            '-',
            'Расчеты с клиентами - 29801',
            `CODE_COA='29801'`
        )
    } /* Расчеты с клиентами - 29801 */

    async customer_funds() { /* Cредства клиентов для конвертации - 22613 */
        return await this.getOneRow(
            '-',
            'Cредства клиентов для конвертации - 22613',
            `CODE_COA='22613'`
        )
    } /* Cредства клиентов для конвертации - 22613 */

    async inner_banks_data() {
        return (await this.getDataInDates(
            '',
            this.innerBanksQuery,
            true
        )).map((b: {NAME?: string}) => ({
            ...b,
            count: '-',
            state: b['NAME']
        }))
    }

    inter_bank_deposits(...args: any) { /* Межбанковские депозиты (10521, 10531, 10541) */
        const [UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR,] = this.currencyNames
            .map(c => getCorrespondentTotal(c, ...args))
        return {
            count: '-',
            state: 'Межбанковские депозиты (10521, 10531, 10541)',
            UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR,
            isTableHead: true
        }
    } /* Межбанковские депозиты (10521, 10531, 10541) */

    async getRows(others?: any) {
        const [
            innerBanks,
            customerFunds,
            accountsSettlement,
        ] = await Promise.all([
            this.inner_banks_data(),
            this.customer_funds(),
            this.accounts_settlement()
        ])
        const interBankDeposits = this.inter_bank_deposits(...innerBanks)
        const liqAssetsTotal = this.liq_assets_total(interBankDeposits, ...others)
        return [
            interBankDeposits,
            ...innerBanks,
            liqAssetsTotal,
            accountsSettlement,
            customerFunds
        ]
    }
}

export default CorrespondentInterbankDepositsCurrent