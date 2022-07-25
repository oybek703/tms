import MainClass from '../mainClass'
import { getData } from '../../models/db_apis'

class GmMainClass extends MainClass {
    codes: {
        checkAccount: string,
        operationType: string,
        codeCurrency: string
    }[]
    constructor(date: string) {
      super(date)
      this.codes = [
        { checkAccount: '20214', operationType: 'Депозиты до востребования', codeCurrency: '840' },
        { checkAccount: '20214', operationType: 'Депозиты до востребования', codeCurrency: '978' },
        { checkAccount: '20214', operationType: 'Депозиты до востребования', codeCurrency: '643' },
        { checkAccount: '20214', operationType: 'Депозиты до востребования', codeCurrency: '000' },
        { checkAccount: '20414', operationType: 'Сберегательный счет (залоговые сред.)', codeCurrency: '840' },
        { checkAccount: '20414', operationType: 'Сберегательный счет (залоговые сред.)', codeCurrency: '978' },
        { checkAccount: '20614', operationType: 'Срочные депозиты', codeCurrency: '840' },
        { checkAccount: '20614', operationType: 'Срочные депозиты', codeCurrency: '978' },
        { checkAccount: '20614', operationType: 'Срочные депозиты', codeCurrency: '643' },
        { checkAccount: '20614', operationType: 'Срочные депозиты', codeCurrency: '000' },
        { checkAccount: '22602', operationType: 'Депозиты клиентов по аккредитивам', codeCurrency: '978' },
        { checkAccount: '22602', operationType: 'Депозиты клиентов по аккредитивам', codeCurrency: '840' },
        { checkAccount: '22602', operationType: 'Депозиты клиентов по аккредитивам', codeCurrency: '643' },
        { checkAccount: '22614', operationType: 'Cконвертированные cредства клиентов', codeCurrency: '643' },
        { checkAccount: '22614', operationType: 'Cконвертированные cредства клиентов', codeCurrency: '978' },
        { checkAccount: '22614', operationType: 'Cконвертированные cредства клиентов', codeCurrency: '840' },
        { checkAccount: '22624', operationType: 'Счет подакцизных товаров', codeCurrency: '000' },
        { checkAccount: '22613', operationType: 'Зарезервированные средства для конвертации', codeCurrency: '000' },
      ]
    }

    gmQuery(
        codeCoa: string = '20214', codeCurrency: string = '000',
        operationType: string = 'Депозиты до востребования'
    ) {
      return `SELECT
                       '${codeCoa}' check_account,
                       '${operationType}' operation_type,
                       PAR_VALUE,
                       '${codeCurrency}' CODE_CURRENCY
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
                              WHERE code_coa = '${codeCoa}'
                                and code_currency = '${codeCurrency}'
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

    accredetivQuery(date: string, codeCurrency: string) {
      return `SELECT ROUND(( NVL(SUM(saldo_out) / POWER(10, 2), 0) ), 2) AS saldo_out
                FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_out
                                FROM   ibs.saldo@iabs sl
                                WHERE  sl.account_code = ac.code
                                  AND sl.oper_day < TO_DATE('${date}', 'DD-MM-YYYY')
                                  AND ROWNUM = 1) AS saldo_out
                        FROM   ibs.accounts@iabs ac
                        WHERE code_coa IN ( '90908', '90909', '90916')
                          AND code_currency = '${codeCurrency}'
                          AND client_code = '00532305')`
    }

    accredetivLiabilityQuery(date: string) {
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

    collateralSavingsQuery(date: string) {
      return `SELECT
                       '20414' CHECK_ACCOUNT,
                       'Сберегательный счет (залоговые сред.)' OPERATION_TYPE,
                       SALDO_OUT PAR_VALUE,
                       '000' CODE_CURRENCY
                FROM (SELECT * FROM GM ORDER BY OPER_DAY DESC) WHERE ROLE='A_C' AND OPER_DAY<TO_DATE('${date}', 'DD.MM.YYYY') 
                AND ROWNUM=1`
    } /* Сберегательный счет (залоговые сред.) */

    autoCreditQuery(date: string) {
      return `SELECT
                       '20414' CHECK_ACCOUNT,
                       'Сберегательный счет (Автокредит)' OPERATION_TYPE,
                       SALDO_OUT PAR_VALUE,
                       '000' CODE_CURRENCY
                FROM (SELECT * FROM GM ORDER BY OPER_DAY DESC) WHERE ROLE='C' AND OPER_DAY<TO_DATE('${date}', 'DD.MM.YYYY') AND ROWNUM=1`
    } /* Сберегательный счет (Автокредит) */

    mioQuery(date: string) {
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


    async getOneRow(codeCoa: string, codeCurrency: string, operationType: string) {
      return await this.getDataInDates(
          '',
          this.gmQuery.bind(this, codeCoa, codeCurrency, operationType)
      )
    }

    async securitySum() {
      return await this.getDataInDates(
          '',
          this.securitySumQuery.bind(this)
      )
    }

    async accredetiv() {/* Аккредетив; Непокрытый текущий аккредитив (МИО); Обязательства по аккредитивам (11501) TODO compute MIO */
      const accredetives = (await Promise.all(['840', '978', '643']
          .map((c) => this.getDataInDates('', this.accredetivQuery.bind(this, this.date, c)))))
          .map((v) => v['SALDO_OUT'])
      const { SALDO_OUT = 0 } = await this.getDataInDates(
          '',
          this.accredetivLiabilityQuery.bind(this, this.date)
      )
      const { SALDO_OUT: mio = 0 } = await this.getDataInDates(
          '',
          this.mioQuery
      )
      return {
        acs: accredetives,
        others: [
          { loan_name: 'Непокрытый текущий аккредитив (МИО)', currency_name: 'USD', par_value: mio },
          { loan_name: 'Обязательства по аккредитивам (11501)', currency_name: 'USD', par_value: SALDO_OUT }
        ]
      }
    } /* Аккредетив; Непокрытый текущий аккредитив (МИО); Обязательства по аккредитивам (11501) */

    async collateralSavings() {/* Сберегательный счет (залоговые сред.) */
      return await this.getDataInDates(
          '',
          this.collateralSavingsQuery
      )
    } /* Сберегательный счет (залоговые сред.) */

    async autoCredit() {/* Сберегательный счет (Автокредит) */
      return await this.getDataInDates(
          '',
          this.autoCreditQuery
      )
    } /* Сберегательный счет (Автокредит) */

    async getCurrencyRate(currencyCode: string = '840') {
      const query = `SELECT equival FROM ibs.s_rate_cur@iabs
                       WHERE date_cross<to_date('${this.date}', 'DD.MM.YYYY') AND
                             code='${currencyCode}' and ROWNUM=1 ORDER BY DATE_CROSS DESC`
      const { rows: [{ EQUIVAL }] } = await getData(query)
      return EQUIVAL
    }

    async getRows() {
      await this.accredetiv()
      const rows = await Promise.all(this.codes
          .map(({ checkAccount, codeCurrency, operationType }) =>
            this.getOneRow(checkAccount, codeCurrency, operationType)))
      const [
        currRates,
        securitySum,
        accredetiv,
        collateralSavings,
        autoCredit
      ] = await Promise.all([
        Promise.all(['840', '978', '643']
            .map((c) => this.getCurrencyRate(c))),
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

export default GmMainClass
