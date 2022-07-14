const MainClass = require("../mainClass")
const {getData} = require("../../models/db_apis")

class GmMainClass extends MainClass {
    constructor(date) {
        super(date)
        this.codes = [
            {check_account: 20214, operation_type: 'Депозиты до востребования', code_currency: '840'},
            {check_account: 20214, operation_type: 'Депозиты до востребования', code_currency: '978'},
            {check_account: 20214, operation_type: 'Депозиты до востребования', code_currency: '643'},
            {check_account: 20214, operation_type: 'Депозиты до востребования', code_currency: '000'},
            {check_account: 20414, operation_type: 'Сберегательный счет (залоговые сред.)', code_currency: '840'},
            {check_account: 20414, operation_type: 'Сберегательный счет (залоговые сред.)', code_currency: '978'},
            {check_account: 20614, operation_type: 'Срочные депозиты', code_currency: '840'},
            {check_account: 20614, operation_type: 'Срочные депозиты', code_currency: '978'},
            {check_account: 20614, operation_type: 'Срочные депозиты', code_currency: '643'},
            {check_account: 20614, operation_type: 'Срочные депозиты', code_currency: '000'},
            {check_account: 22602, operation_type: 'Депозиты клиентов по аккредитивам', code_currency: '978'},
            {check_account: 22602, operation_type: 'Депозиты клиентов по аккредитивам', code_currency: '840'},
            {check_account: 22602, operation_type: 'Депозиты клиентов по аккредитивам', code_currency: '643'},
            {check_account: 22614, operation_type: 'Cконвертированные cредства клиентов', code_currency: '643'},
            {check_account: 22614, operation_type: 'Cконвертированные cредства клиентов', code_currency: '978'},
            {check_account: 22614, operation_type: 'Cконвертированные cредства клиентов', code_currency: '840'},
            {check_account: 22624, operation_type: 'Счет подакцизных товаров', code_currency: '000'},
            {check_account: 22613, operation_type: 'Зарезервированные средства для конвертации', code_currency: '000'},
        ]
    }

    gmQuery(
        code_coa = '20214', code_currency = '000',
        operation_type = 'Депозиты до востребования'
    ) {
        return `SELECT
                       '${code_coa}' check_account,
                       '${operation_type}' operation_type,
                       PAR_VALUE,
                       '${code_currency}' CODE_CURRENCY
                FROM (SELECT
                   PAR_VALUE
               FROM (SELECT ROUND((NVL(SUM(saldo_out) / POWER(10, 2), 0)), 2) PAR_VALUE
                     FROM (
                              SELECT (
                                         SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                saldo_out
                                         FROM ibs.saldo@iabs sl
                                         WHERE sl.account_code = ac.code
                                           AND sl.oper_day < TO_DATE('${this.date}', 'DD-MM-YYYY')
                                           AND ROWNUM = 1
                                     ) AS saldo_out
                              FROM ibs.accounts@iabs ac
                              WHERE code_coa = '${code_coa}'
                                and code_currency = '${code_currency}'
                                and code_filial in ('00073', '00873', '01169')
                                and client_code = '00532305'
                          )))`
    }

    securitySumQuery() {
        return `SELECT
                       '' check_account,
                       'Сумма обеспечение обя. по акк. (20214)' operation_type,
                       PAR_VALUE,
                       '000' CODE_CURRENCY
                FROM (SELECT
                   PAR_VALUE
               FROM (SELECT ROUND((NVL(SUM(saldo_out) / POWER(10, 2), 0)), 2) PAR_VALUE
                     FROM (
                              SELECT (
                                         SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                saldo_out
                                         FROM ibs.saldo@iabs sl
                                         WHERE sl.account_code = ac.code
                                           AND sl.oper_day < TO_DATE('${this.date}', 'DD-MM-YYYY')
                                           AND ROWNUM = 1
                                     ) AS saldo_out
                              FROM ibs.accounts@iabs ac
                              WHERE code_coa = '20214'
                                and code_currency = '000'
                                and code_filial in ('00073', '00873', '01169')
                                and client_code = '00532305'
                                and substr(code,8,20)='20214000900532305035'
                          )))`
    }

    accredetivQuery(date, code_currency) {
        return `SELECT ROUND(( NVL(SUM(saldo_out) / POWER(10, 2), 0) ), 2) AS saldo_out
                FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_out
                                FROM   ibs.saldo@iabs sl
                                WHERE  sl.account_code = ac.code
                                  AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                  AND ROWNUM = 1) AS saldo_out
                        FROM   ibs.accounts@iabs ac
                        WHERE code_coa IN ( '90908', '90909', '90916')
                          AND code_currency = '${code_currency}'
                          AND client_code = '00532305')`
    }

    accredetivLiabilityQuery(date) {
        return `SELECT ROUND(( NVL(SUM(saldo_out) / POWER(10, 2), 0) ), 2) AS saldo_out
                FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_out
                                FROM   ibs.saldo@iabs sl
                                WHERE  sl.account_code = ac.code
                                  AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                  AND ROWNUM = 1) AS saldo_out
                        FROM   ibs.accounts@iabs ac
                        WHERE code_coa='11501'
                          AND code_currency = '840'
                          AND client_code = '00532305')`
    }

    collateralSavingsQuery(date) {
        return `SELECT
                       '20414' CHECK_ACCOUNT,
                       'Сберегательный счет (залоговые сред.)' OPERATION_TYPE,
                       SALDO_OUT PAR_VALUE,
                       '000' CODE_CURRENCY
                FROM (SELECT * FROM GM ORDER BY OPER_DAY DESC) WHERE ROLE='A_C' AND OPER_DAY<TO_DATE('${date}', 'DD.MM.YYYY') 
                AND ROWNUM=1`
    } /* Сберегательный счет (залоговые сред.) */

    autoCreditQuery(date) {
        return `SELECT
                       '20414' CHECK_ACCOUNT,
                       'Сберегательный счет (Автокредит)' OPERATION_TYPE,
                       SALDO_OUT PAR_VALUE,
                       '000' CODE_CURRENCY
                FROM (SELECT * FROM GM ORDER BY OPER_DAY DESC) WHERE ROLE='C' AND OPER_DAY<TO_DATE('${date}', 'DD.MM.YYYY') AND ROWNUM=1`
    } /* Сберегательный счет (Автокредит) */

    mioQuery(date) {
        return `SELECT
                    SALDO_OUT
                FROM (SELECT * FROM GM ORDER BY OPER_DAY DESC)
                WHERE
                    ROLE='MIO'
                  AND
                    OPER_DAY<=TO_DATE('${date}', 'DD.MM.YYYY')
                  AND
                    ROWNUM=1`
    } /* Непокрытый текущий аккредитив (МИО) */


    async getOneRow(code_coa, code_currency, operation_type) {
        return await this.getDataInDates('', false,
            this.gmQuery.bind(this, code_coa, code_currency, operation_type))
    }

    async securitySum() {
        return await this.getDataInDates('', false,
            this.securitySumQuery.bind(this))
    }

    async accredetiv() { /* Аккредетив; Непокрытый текущий аккредитив (МИО); Обязательства по аккредитивам (11501) TODO compute MIO */
        const accredetives   = (await Promise.all(['840', '978', '643']
            .map(c => this.getDataInDates('', false, this.accredetivQuery.bind(this, this.date, c)))))
            .map(v => v['SALDO_OUT'])
        const {SALDO_OUT = 0} = await this.getDataInDates('',
            false, this.accredetivLiabilityQuery.bind(this, this.date))
        const {SALDO_OUT: mio = 0} = await this.getDataInDates('', false, this.mioQuery)
        return {
            acs: accredetives,
            others: [
                {loan_name: 'Непокрытый текущий аккредитив (МИО)', currency_name: 'USD', par_value: mio},
                {loan_name: 'Обязательства по аккредитивам (11501)', currency_name: 'USD', par_value: SALDO_OUT}
            ]
        }
    } /* Аккредетив; Непокрытый текущий аккредитив (МИО); Обязательства по аккредитивам (11501) */

    async collateralSavings() { /* Сберегательный счет (залоговые сред.) */
        return await this.getDataInDates('', false,
            this.collateralSavingsQuery)
    } /* Сберегательный счет (залоговые сред.) */

    async autoCredit() { /* Сберегательный счет (Автокредит) */
        return await this.getDataInDates('', false,
            this.autoCreditQuery)
    } /* Сберегательный счет (Автокредит) */

    async getCurrencyRate(currency_code = '840') {
        const query = `SELECT equival FROM ibs.s_rate_cur@iabs
                       WHERE date_cross<to_date('${this.date}', 'DD.MM.YYYY') AND
                             code='${currency_code}' and ROWNUM=1 ORDER BY DATE_CROSS DESC`
        const {rows: [{EQUIVAL}]} = await getData(query)
        return EQUIVAL
    }

    async getRows() {
        await this.accredetiv()
        const rows = await Promise.all(this.codes
                .map(({check_account, code_currency, operation_type}) =>
                    this.getOneRow(check_account, code_currency, operation_type)))
        const [
            currRates,
            securitySum,
            accredetiv,
            collateralSavings,
            autoCredit
        ] = await Promise.all([
            Promise.all(['840', '978', '643']
                .map(c => this.getCurrencyRate(c))),
            this.securitySum(),
            this.accredetiv(),
            this.collateralSavings(),
            this.autoCredit()
        ])
        const tableData = [
            ...rows.slice(0, 4),
            securitySum,
            ...rows.slice(4)
        ]
        return {
            tableData: [
                ...tableData.slice(0, 7),
                collateralSavings,
                autoCredit,
                ...tableData.slice(7)
            ],
            accredetiv,
            currRates
        }
    }
}

module.exports = GmMainClass