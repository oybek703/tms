import { OwnQuery } from '../mainClass'
import CorrespondentMainClass from './CorrespondentMainClass'
import { corr_include, getCorrespondentTotal } from './corr_pure_functions'

class TotalCash extends CorrespondentMainClass {
    other_banks: {name: string; code: string}[]
    constructor(date: string) {
        super(date)
        this.other_banks = [
            {name: 'Ипак Йули банк, Uzbekistan', code: '00000444'},
            {name: 'НБ ВЭД РУз, Uzbekistan', code: '00000450'},
            {name: 'Asia  Invest bank, Russia', code: '00090007'},
            {name: 'Landesbank Berlin, Germany', code: '00090017'},
            {name: 'Citi Bank, New York, USA', code: '00090020'},
            {name: 'Commerzbank FFT, Germany', code: '00090021'},
            {name: 'Gazprombank, Russia', code: '00090027'},
            {name: 'JP Morgan Chase New York, USA', code: '00090036'},
            {name: 'JP Morgan Chase London, Great Britain', code: '00090037'},
            {name: 'Landes Bank Baden-Wuerttemberg, Germany', code: '00090047'},
            {name: 'Reiffeisen Bank Viena, Austria', code: '00090057'},
            {name: 'Transkapitalbank, Moscow', code: '00090067'},
            {name: 'United Bank Swiss, Switzerland', code: '00090071'},
            {name: 'VTB, Russia', code: '00090077'},
            {name: 'Keb Hana Bank, Seoul, Korea, ', code: '00090121'},
            {name: 'Esxata Bank, Tadjikistan', code: '0'},
            {name: 'Hypo Vereinsbank, Germany', code: '99991222'},
            {name: 'Sumitomo Mitsui Bank Tokyo, Japan', code: '00090063'},
            {name: 'Unicredit Bank Ag', code: '0'},
            {name: 'RosEximbnak, Russia', code: '0'},
        ]
    }

    formatQuery(date: string, whereQuery = '00000444') {
        return `SELECT (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day < TO_DATE('${date}',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10501'
                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
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
                                WHERE  code_coa = '10501'
                                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
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
                                WHERE  code_coa = '10501'
                                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
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
                                WHERE  code_coa = '10501'
                                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
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
                                WHERE  code_coa = '10501'
                                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
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
                                WHERE  code_coa = '10501'
                                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
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
                                WHERE  code_coa = '10501'
                                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
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
                                WHERE  code_coa = '10501'
                                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
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
                                WHERE  code_coa = '10501'
                                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
                                  AND code_currency = '978')) AS EUR
                FROM   dual`
    }

    nostroQuery(date: Date) {
        return `SELECT ROUND((SELECT SUM(saldo_equival_out)
              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                    saldo_equival_out
                             FROM   ibs.saldo@iabs sl
                             WHERE  sl.account_code = ac.code
                               AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                               AND ROWNUM = 1) AS saldo_equival_out
                     FROM   ibs.accounts@iabs AC
                     WHERE  code_coa = '10301'
                       AND code_currency = '000')) / POWER(10, 8), 2) AS UZS,
                       ROUND(NVL((SELECT SUM(saldo_out)
                                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                        saldo_out
                                                 FROM   ibs.saldo@iabs sl
                                                 WHERE  sl.account_code = ac.code
                                                   AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                                   AND ROWNUM = 1) AS saldo_out
                                         FROM   ibs.accounts@iabs AC
                                         WHERE  code_coa = '10301'
                                           AND code_currency = '156')), 0) / POWER(10, 8), 2) AS CNY,
                       ROUND(NVL((SELECT SUM(saldo_out)
                                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                        saldo_out
                                                 FROM   ibs.saldo@iabs sl
                                                 WHERE  sl.account_code = ac.code
                                                   AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                                   AND ROWNUM = 1) AS saldo_out
                                         FROM   ibs.accounts@iabs AC
                                         WHERE  code_coa = '10301'
                                           AND code_currency = '392')), 0) / POWER(10, 8), 2) AS JPY,
                       ROUND(NVL((SELECT SUM(saldo_out)
                                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                        saldo_out
                                                 FROM   ibs.saldo@iabs sl
                                                 WHERE  sl.account_code = ac.code
                                                   AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                                   AND ROWNUM = 1) AS saldo_out
                                         FROM   ibs.accounts@iabs AC
                                         WHERE  code_coa = '10301'
                                           AND code_currency = '398')), 0) / POWER(10, 8), 2) AS KZT,
                       ROUND(NVL((SELECT SUM(saldo_out)
                                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                        saldo_out
                                                 FROM   ibs.saldo@iabs sl
                                                 WHERE  sl.account_code = ac.code
                                                   AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                                   AND ROWNUM = 1) AS saldo_out
                                         FROM   ibs.accounts@iabs AC
                                         WHERE  code_coa = '10301'
                                           AND code_currency = '643')), 0) / POWER(10, 8), 2) AS RUB,
                       ROUND(NVL((SELECT SUM(saldo_out)
                                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                        saldo_out
                                                 FROM   ibs.saldo@iabs sl
                                                 WHERE  sl.account_code = ac.code
                                                   AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                                   AND ROWNUM = 1) AS saldo_out
                                         FROM   ibs.accounts@iabs AC
                                         WHERE  code_coa = '10301'
                                           AND code_currency = '756')), 0) / POWER(10, 8), 2) AS CHF,
                       ROUND(NVL((SELECT SUM(saldo_out)
                                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                        saldo_out
                                                 FROM   ibs.saldo@iabs sl
                                                 WHERE  sl.account_code = ac.code
                                                   AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                                   AND ROWNUM = 1) AS saldo_out
                                         FROM   ibs.accounts@iabs AC
                                         WHERE  code_coa = '10301'
                                           AND code_currency = '826')), 0) / POWER(10, 8), 2) AS GBP,
                       ROUND(NVL((SELECT SUM(saldo_out)
                                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                        saldo_out
                                                 FROM   ibs.saldo@iabs sl
                                                 WHERE  sl.account_code = ac.code
                                                   AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                                   AND ROWNUM = 1) AS saldo_out
                                         FROM   ibs.accounts@iabs AC
                                         WHERE  code_coa = '10301'
                                           AND code_currency = '840')), 0) / POWER(10, 8), 2) AS USD,
                       ROUND(NVL((SELECT SUM(saldo_out)
                                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                        saldo_out
                                                 FROM   ibs.saldo@iabs sl
                                                 WHERE  sl.account_code = ac.code
                                                   AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                                   AND ROWNUM = 1) AS saldo_out
                                         FROM   ibs.accounts@iabs AC
                                         WHERE  code_coa = '10301'
                                           AND code_currency = '978')), 0) / POWER(10, 8), 2) AS EUR
                FROM   dual`
    }

    forQuery(date: Date) {
        return `SELECT ROUND(NVL((SELECT SUM(saldo_equival_out)
                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                        saldo_equival_out
                                 FROM   ibs.saldo@iabs sl
                                 WHERE  sl.account_code = ac.code
                                   AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                   AND ROWNUM = 1) AS saldo_equival_out
                         FROM   ibs.accounts@iabs AC
                         WHERE  code_coa = '10309'
                           AND code_currency = '000')), 0) / POWER(10, 8), 2) AS UZS,
                       ROUND(NVL((SELECT SUM(saldo_out)
                                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                        saldo_out
                                                 FROM   ibs.saldo@iabs sl
                                                 WHERE  sl.account_code = ac.code
                                                   AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                                   AND ROWNUM = 1) AS saldo_out
                                         FROM   ibs.accounts@iabs AC
                                         WHERE  code_coa = '10309'
                                           AND code_currency = '156')), 0) / POWER(10, 8), 2) AS CNY,
                       ROUND(NVL((SELECT SUM(saldo_out)
                                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                        saldo_out
                                                 FROM   ibs.saldo@iabs sl
                                                 WHERE  sl.account_code = ac.code
                                                   AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                                   AND ROWNUM = 1) AS saldo_out
                                         FROM   ibs.accounts@iabs AC
                                         WHERE  code_coa = '10309'
                                           AND code_currency = '392')), 0) / POWER(10, 8), 2) AS JPY,
                       ROUND(NVL((SELECT SUM(saldo_out)
                                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                        saldo_out
                                                 FROM   ibs.saldo@iabs sl
                                                 WHERE  sl.account_code = ac.code
                                                   AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                                   AND ROWNUM = 1) AS saldo_out
                                         FROM   ibs.accounts@iabs AC
                                         WHERE  code_coa = '10309'
                                           AND code_currency = '398')), 0) / POWER(10, 8), 2) AS KZT,
                       ROUND(NVL((SELECT SUM(saldo_out)
                                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                        saldo_out
                                                 FROM   ibs.saldo@iabs sl
                                                 WHERE  sl.account_code = ac.code
                                                   AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                                   AND ROWNUM = 1) AS saldo_out
                                         FROM   ibs.accounts@iabs AC
                                         WHERE  code_coa = '10309'
                                           AND code_currency = '643')), 0) / POWER(10, 8), 2) AS RUB,
                       ROUND(NVL((SELECT SUM(saldo_out)
                                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                        saldo_out
                                                 FROM   ibs.saldo@iabs sl
                                                 WHERE  sl.account_code = ac.code
                                                   AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                                   AND ROWNUM = 1) AS saldo_out
                                         FROM   ibs.accounts@iabs AC
                                         WHERE  code_coa = '10309'
                                           AND code_currency = '756')), 0) / POWER(10, 8), 2) AS CHF,
                       ROUND(NVL((SELECT SUM(saldo_out)
                                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                        saldo_out
                                                 FROM   ibs.saldo@iabs sl
                                                 WHERE  sl.account_code = ac.code
                                                   AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                                   AND ROWNUM = 1) AS saldo_out
                                         FROM   ibs.accounts@iabs AC
                                         WHERE  code_coa = '10309'
                                           AND code_currency = '826')), 0) / POWER(10, 8), 2) AS GBP,
                       ROUND(NVL((SELECT SUM(saldo_out)
                                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                        saldo_out
                                                 FROM   ibs.saldo@iabs sl
                                                 WHERE  sl.account_code = ac.code
                                                   AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                                   AND ROWNUM = 1) AS saldo_out
                                         FROM   ibs.accounts@iabs AC
                                         WHERE  code_coa = '10309'
                                           AND code_currency = '840')), 0) / POWER(10, 8), 2) AS USD,
                       ROUND(NVL((SELECT SUM(saldo_out)
                                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                        saldo_out
                                                 FROM   ibs.saldo@iabs sl
                                                 WHERE  sl.account_code = ac.code
                                                   AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                                   AND ROWNUM = 1) AS saldo_out
                                         FROM   ibs.accounts@iabs AC
                                         WHERE  code_coa = '10309'
                                           AND code_currency = '978')), 0) / POWER(10, 8), 2) AS EUR
                FROM   dual`
    }

    async getOneRow(count: string, state: string, code_coa: string, ownQuery: OwnQuery, isTableHead: boolean = false, isNegative?: boolean) {
        return super.getOneRow(count, state, code_coa, ownQuery, isTableHead, isNegative)
    }

    async total_cash_on_hand() { /* Всего денежные наличности в кассе */
        return await this.getOneRow(
            '1',
            'Всего денежная наличность в кассе',
            '',
            this.correspondentQuery('10100'),
            true
        )
    } /* Всего денежные наличности в кассе */

    cash_at_checkout(total: any, on_hand: any) { /* Наличные деньги в кассе */
        const [UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR] = this.currencyNames.map((c: string) => total[c]-on_hand[c])
        return {
            count: 1.1,
            state: 'Наличные деньги в кассе',
            UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR
        }
    } /* Наличные деньги в кассе */

    async cash_on_road() { /* Денежная наличность в обменных пунктах, банкоматах и деньги в пути */
        return await this.getOneRow(
            '1.2',
            'Денежная наличность в обменных пунктах, банкоматах и деньги в пути',
            '',
            this.correspondentQuery('10103')
        )
    } /* Денежная наличность в обменных пунктах, банкоматах и деньги в пути */

    total_correspondent_accounts(nostro: any, ob_nostro: any) { /* Всего корреспондентские счета */
        const [UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR] = this.currencyNames.map((c: string) => nostro[c]+ob_nostro[c])
        return {
            count: '2',
            state: 'Всего корреспондентские счета',
            UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR,
            isTableHead: true
        }
    } /* Всего корреспондентские счета */

    corres_accounts_inCB() { /* Корреспондентские счета в ЦБРУ */
        return {
            count: '2.1',
            state: 'Корреспондентские счета в ЦБРУ',
            UZS: '', CNY: '', JPY: '', KZT: '', RUB: '', CHF: '', GBP: '', USD: '', EUR: '',
            isTableHead: true
        }
    } /* Корреспондентские счета в ЦБРУ */

    async nostro() { /* Ностро */
        return await this.getOneRow(
            '-',
            'Ностро',
            '',
            this.nostroQuery
        )
    } /* Ностро */

    async f_o_r() { /* ФОР */
        return await this.getOneRow(
            '-',
            'ФОР',
            '',
            this.forQuery
        )
    } /* ФОР */

    corres_accounts_inOB() { /* Корреспондентские счета в других банках */
        return {
            count: '2.2',
            state: 'Корреспондентские счета в других банках',
            UZS: '', CNY: '', JPY: '', KZT: '', RUB: '', CHF: '', GBP: '', USD: '', EUR: '',
            isTableHead: true
        }
    } /* Корреспондентские счета в других банках */

    ob_nostro(...args: any) { /* Ностро */
        const [UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR,] = this.currencyNames
            .map((c: string) => getCorrespondentTotal(c, ...args))
        return {
            count: '-',
            state: 'Ностро',
            UZS, CNY, JPY, KZT, RUB, CHF, GBP, USD, EUR,
            isTableHead: true
        }
    } /* Ностро */

    async getRows() {
        const otherBankPromises = this.other_banks
            .map(({name, code}) => this.getOneRow('-', name, code, null))
        const [
            totalCashOnHand,
            cashOnRoad,
            nostro,
            F_O_R,
            otherBanks
        ] = await Promise.all([
            this.total_cash_on_hand(),
            this.cash_on_road(),
            this.nostro(),
            this.f_o_r(),
            Promise.all(otherBankPromises)
        ])
        const cashAtCheckout = this.cash_at_checkout(totalCashOnHand, cashOnRoad)
        const obNostro = this.ob_nostro(...otherBanks)
        const totalCorrespondentAccounts = this.total_correspondent_accounts(nostro, obNostro)
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
                ...otherBanks
            ]
        ]
    }
}

export default TotalCash