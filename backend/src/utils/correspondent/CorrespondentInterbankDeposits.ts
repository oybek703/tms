import CorrespondentMainClass from './CorrespondentMainClass'
import { getCorrespondentTotal } from './corr_pure_functions'

class CorrespondentInterbankDeposits extends CorrespondentMainClass {
    inner_banks: {name: string; code: string}[]

    constructor(date: string) {
        super(date)
        this.inner_banks = [
            {name: 'HSBC, Great Britain', code: '99991286'},
            {name: 'Landes Bank Baden-Wuerttemberg, Germany', code: '00090047'},
            {name: 'Reiffeisen Bank Viena, Austria', code: '00090057'},
            {name: 'DZ Bank, Frankfurt', code: '00090111'},
            {name: 'Asia  Invest bank, Russia', code: '00090007'},
            {name: 'Commerzbank FFT, Germany', code: '00090021'},
            {name: 'Industrial and Commercial Bank of China (Almaty) JSC', code: '00090142'},
            {name: 'Bank Esxata, Tajikistan', code: '0'},
            {name: 'Unicreditbank, Italy', code: '99991099'},
            {name: 'Sberbank, Russia', code: '00090127'},
            {name: 'Transkapitalbank, Moscow', code: '00090067'},
            {name: 'Novikombank Russia', code: '00090051'},
            {name: 'Mikrokreditbank, Uzbekistan', code: '00000433'},
            {name: 'Uzpromstroybank, Uzbekistan', code: '00000440'},
            {name: 'NBU, Uzbekistan', code: '00000450'},
            {name: 'Aloqabank, Uzbekistan', code: '0'},
            {name: 'Turon bank, Uzbekistan', code: '00000446'},
            {name: 'Orien finance bank, Uzbekistan', code: '0'},
            {name: 'InFinBank, Uzbekistan', code: '00001041'},
            {name: 'Ipoteka bank, Uzbekistan', code: '00000937'},
            {name: 'Turkistonbank, Uzbekistan', code: '0'},
            {name: 'Universalbank, Uzbekistan', code: '0'},
            {name: 'Orient Finance bank, Uzbekistan', code: '00001071'},
            {name: 'Qishliq qurilish bank, Uzbekistan', code: '00001037'},
            {name: 'Hamkorbank. Uzbekistan', code: '00000083'},
            {name: 'Halq bank, Uzbekistan', code: '00001125'},
            {name: 'Ipak Yuli bank, Uzbekistan', code: '00000444'},
        ]
    }

    formatQuery(date: string, where_query = '99991286') {
        return `SELECT (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day < TO_DATE('${date}',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                  AND SUBSTR(code, 17, 8) = '${where_query}'
                  AND code_currency = '000')) AS UZS,
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 6), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < TO_DATE('${date}',
                                                                     'DD-MM-YYYY')
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) = '${where_query}'
                                  AND code_currency = '156')) AS CNY,
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 6), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < TO_DATE('${date}',
                                                                     'DD-MM-YYYY')
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) = '${where_query}'
                                  AND code_currency = '392')) AS JPY,
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < TO_DATE('${date}',
                                                                     'DD-MM-YYYY')
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) = '${where_query}'
                                  AND code_currency = '398')) AS KZT,
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < TO_DATE('${date}',
                                                                     'DD-MM-YYYY')
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) = '${where_query}'
                                  AND code_currency = '643')) AS RUB,
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < TO_DATE('${date}',
                                                                     'DD-MM-YYYY')
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) = '${where_query}'
                                  AND code_currency = '756')) AS CHF,
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < TO_DATE('${date}',
                                                                     'DD-MM-YYYY')
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) = '${where_query}'
                                  AND code_currency = '826')) AS GBP,
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < TO_DATE('${date}',
                                                                     'DD-MM-YYYY')
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) = '${where_query}'
                                  AND code_currency = '840')) AS USD,
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < TO_DATE('${date}',
                                                                     'DD-MM-YYYY')
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) = '${where_query}'
                                  AND code_currency = '978')) AS EUR
                FROM   dual`
    }

    agroBankQuery(date: string) {
        return `SELECT (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day < TO_DATE('${date}',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                  AND code_currency = '000')) AS UZS,
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 6), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < TO_DATE('${date}',
                                                                     'DD-MM-YYYY')
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                                  AND code_currency = '156')) AS CNY,
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 6), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < TO_DATE('${date}',
                                                                     'DD-MM-YYYY')
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                                  AND code_currency = '392')) AS JPY,
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < TO_DATE('${date}',
                                                                     'DD-MM-YYYY')
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                                  AND code_currency = '398')) AS KZT,
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < TO_DATE('${date}',
                                                                     'DD-MM-YYYY')
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                                  AND code_currency = '643')) AS RUB,
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < TO_DATE('${date}',
                                                                     'DD-MM-YYYY')
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                                  AND code_currency = '756')) AS CHF,
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < TO_DATE('${date}',
                                                                     'DD-MM-YYYY')
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                                  AND code_currency = '826')) AS GBP,
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < TO_DATE('${date}',
                                                                     'DD-MM-YYYY')
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                                  AND code_currency = '840')) AS USD,
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < TO_DATE('${date}',
                                                                     'DD-MM-YYYY')
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                                  AND code_currency = '978')) AS EUR
                FROM   dual`
    }

    customerFundsQuery(date: string) {
        return `SELECT ROUND((SELECT SUM(saldo_out)
              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                    saldo_out
                             FROM   ibs.saldo@iabs sl
                             WHERE  sl.account_code = ac.code
                               AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                               AND ROWNUM = 1) AS saldo_out
                     FROM   ibs.accounts@iabs AC
                     WHERE  code_coa = '22613'
                       AND code_currency = '000'))/POWER(10, 8), 2) AS UZS,
                       ROUND((SELECT SUM(saldo_out)
                              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                    saldo_out
                                             FROM   ibs.saldo@iabs sl
                                             WHERE  sl.account_code = ac.code
                                               AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                               AND ROWNUM = 1) AS saldo_out
                                     FROM   ibs.accounts@iabs AC
                                     WHERE  code_coa = '22613'
                                       AND code_currency = '156'))/POWER(10, 8), 2) AS CNY,
                       ROUND((SELECT SUM(saldo_out)
                              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                    saldo_out
                                             FROM   ibs.saldo@iabs sl
                                             WHERE  sl.account_code = ac.code
                                               AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                               AND ROWNUM = 1) AS saldo_out
                                     FROM   ibs.accounts@iabs AC
                                     WHERE  code_coa = '22613'
                                       AND code_currency = '392'))/POWER(10, 8), 2) AS JPY,
                       ROUND((SELECT SUM(saldo_out)
                              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                    saldo_out
                                             FROM   ibs.saldo@iabs sl
                                             WHERE  sl.account_code = ac.code
                                               AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                               AND ROWNUM = 1) AS saldo_out
                                     FROM   ibs.accounts@iabs AC
                                     WHERE  code_coa = '22613'
                                       AND code_currency = '398'))/POWER(10, 8), 2) AS KZT,
                       ROUND((SELECT SUM(saldo_out)
                              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                    saldo_out
                                             FROM   ibs.saldo@iabs sl
                                             WHERE  sl.account_code = ac.code
                                               AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                               AND ROWNUM = 1) AS saldo_out
                                     FROM   ibs.accounts@iabs AC
                                     WHERE  code_coa = '22613'
                                       AND code_currency = '643'))/POWER(10, 8), 2) AS RUB,
                       ROUND((SELECT SUM(saldo_out)
                              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                    saldo_out
                                             FROM   ibs.saldo@iabs sl
                                             WHERE  sl.account_code = ac.code
                                               AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                               AND ROWNUM = 1) AS saldo_out
                                     FROM   ibs.accounts@iabs AC
                                     WHERE  code_coa = '22613'
                                       AND code_currency = '756'))/POWER(10, 8), 2) AS CHF,
                       ROUND((SELECT SUM(saldo_out)
                              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                    saldo_out
                                             FROM   ibs.saldo@iabs sl
                                             WHERE  sl.account_code = ac.code
                                               AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                               AND ROWNUM = 1) AS saldo_out
                                     FROM   ibs.accounts@iabs AC
                                     WHERE  code_coa = '22613'
                                       AND code_currency = '826'))/POWER(10, 8), 2) AS GBP,
                       ROUND((SELECT SUM(saldo_out)
                              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                    saldo_out
                                             FROM   ibs.saldo@iabs sl
                                             WHERE  sl.account_code = ac.code
                                               AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                               AND ROWNUM = 1) AS saldo_out
                                     FROM   ibs.accounts@iabs AC
                                     WHERE  code_coa = '22613'
                                       AND code_currency = '840'))/POWER(10, 8), 2) AS USD,
                       ROUND((SELECT SUM(saldo_out)
                              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                    saldo_out
                                             FROM   ibs.saldo@iabs sl
                                             WHERE  sl.account_code = ac.code
                                               AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                               AND ROWNUM = 1) AS saldo_out
                                     FROM   ibs.accounts@iabs AC
                                     WHERE  code_coa = '22613'
                                       AND code_currency = '978'))/POWER(10, 8), 2) AS EUR
                FROM   dual`
    }

    inner_bank_deposits(...args: any) { /* Межбанковские депозиты (10521, 10531, 10541) */
        const [UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR] = this.currencyNames
            .map(c => getCorrespondentTotal(c, ...args))
        return {
            count: '-',
            state: 'Межбанковские депозиты (10521, 10531, 10541)',
            UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR,
            isTableHead: true
        }
    } /* Межбанковские депозиты (10521, 10531, 10541) */

    async agro_bank() { /* Agrobank.Uzbekistan */
        return await this.getOneRow(
            '-',
            'Agrobank.Uzbekistan',
            '',
            this.agroBankQuery,
            false
        )
    } /* Agrobank.Uzbekistan */

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
            '',
            this.correspondentQuery('29801')
        )
    } /* Расчеты с клиентами - 29801 */

    async customer_funds() { /* Cредства клиентов для конвертации - 22613 */
        return await this.getOneRow(
            '-',
            'Cредства клиентов для конвертации - 22613',
            '',
            this.customerFundsQuery
        )
    } /* Cредства клиентов для конвертации - 22613 */

    async getRows(others?: any) {
        const innerBankPromises = this.inner_banks
            .map(({name, code}) => this.getOneRow('-', name, code, null))
        const [
            innerBanks,
            customerFunds,
            agroBank,
            accountsSettlement
        ] = await Promise.all([
            Promise.all(innerBankPromises),
            this.customer_funds(),
            this.agro_bank(),
            this.accounts_settlement()
        ])
        const innerBankDeposits = this.inner_bank_deposits(agroBank, ...innerBanks)
        const liqAssetsTotal = this.liq_assets_total(innerBankDeposits, ...others)
        return [
            innerBankDeposits,
            ...[...innerBanks].slice(0, 17),
            agroBank,
            ...[...innerBanks].slice(17),
            liqAssetsTotal,
            accountsSettlement,
            customerFunds
        ]
    }
}

export default CorrespondentInterbankDeposits