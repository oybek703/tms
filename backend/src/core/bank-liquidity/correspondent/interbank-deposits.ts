import { CorrespondentBase } from './correspondent.base'
import { ICorrespondentRow } from './correspondent.interface'

export class InterbankDeposits extends CorrespondentBase {
  innerBanks = [
    { name: 'HSBC, Great Britain', code: '99991286' },
    { name: 'Landes Bank Baden-Wuerttemberg, Germany', code: '00090047' },
    { name: 'Reiffeisen Bank Viena, Austria', code: '00090057' },
    { name: 'DZ Bank, Frankfurt', code: '00090111' },
    { name: 'Asia  Invest bank, Russia', code: '00090007' },
    { name: 'Commerzbank FFT, Germany', code: '00090021' },
    { name: 'Industrial and Commercial Bank of China (Almaty) JSC', code: '00090142' },
    { name: 'Bank Esxata, Tajikistan', code: '0' },
    { name: 'Unicreditbank, Italy', code: '99991099' },
    { name: 'Sberbank, Russia', code: '00090127' },
    { name: 'Transkapitalbank, Moscow', code: '00090067' },
    { name: 'Novikombank Russia', code: '00090051' },
    { name: 'Mikrokreditbank, Uzbekistan', code: '00000433' },
    { name: 'Uzpromstroybank, Uzbekistan', code: '00000440' },
    { name: 'NBU, Uzbekistan', code: '00000450' },
    { name: 'Aloqabank, Uzbekistan', code: '0' },
    { name: 'Turon bank, Uzbekistan', code: '00000446' },
    { name: 'Orien finance bank, Uzbekistan', code: '0' },
    { name: 'InFinBank, Uzbekistan', code: '00001041' },
    { name: 'Ipoteka bank, Uzbekistan', code: '00000937' },
    { name: 'Turkistonbank, Uzbekistan', code: '0' },
    { name: 'Universalbank, Uzbekistan', code: '0' },
    { name: 'Orient Finance bank, Uzbekistan', code: '00001071' },
    { name: 'Qishliq qurilish bank, Uzbekistan', code: '00001037' },
    { name: 'Hamkorbank. Uzbekistan', code: '00000083' },
    { name: 'Halq bank, Uzbekistan', code: '00001125' },
    { name: 'Ipak Yuli bank, Uzbekistan', code: '00000444' }
  ]

  formatQuery(whereQuery = '99991286') {
    return `SELECT (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day < DATE '${this.date}'
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
                  AND code_currency = '000')) AS "uzs",
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 6), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < DATE '${this.date}'
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
                                  AND code_currency = '156')) AS "cny",
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 6), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < DATE '${this.date}'
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
                                  AND code_currency = '392')) AS "jpy",
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < DATE '${this.date}'
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
                                  AND code_currency = '398')) AS "kzt",
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < DATE '${this.date}'
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
                                  AND code_currency = '643')) AS "rub",
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < DATE '${this.date}'
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
                                  AND code_currency = '756')) AS "chf",
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < DATE '${this.date}'
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
                                  AND code_currency = '826')) AS "gbp",
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < DATE '${this.date}'
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
                                  AND code_currency = '840')) AS "usd",
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < DATE '${this.date}'
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) = '${whereQuery}'
                                  AND code_currency = '978')) AS "eur"
                FROM   dual`
  }

  agroBankQuery = () => {
    return `SELECT (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day < DATE '${this.date}'
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                  AND code_currency = '000')) AS "uzs",
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 6), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < DATE '${this.date}'
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                                  AND code_currency = '156')) AS "cny",
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 6), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < DATE '${this.date}'
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                                  AND code_currency = '392')) AS "jpy",
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < DATE '${this.date}'
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                                  AND code_currency = '398')) AS "kzt",
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < DATE '${this.date}'
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                                  AND code_currency = '643')) AS "rub",
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < DATE '${this.date}'
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                                  AND code_currency = '756')) AS "chf",
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < DATE '${this.date}'
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                                  AND code_currency = '826')) AS "gbp",
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < DATE '${this.date}'
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                                  AND code_currency = '840')) AS "usd",
                       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
                        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_out
                                        FROM   ibs.saldo@iabs sl
                                        WHERE  sl.account_code = ac.code
                                          AND sl.oper_day < DATE '${this.date}'
                                          AND ROWNUM = 1) AS saldo_out
                                FROM   ibs.accounts@iabs AC
                                WHERE  CODE_COA IN ('10597', '10531', '10541', '10521')
                                  AND SUBSTR(code, 17, 8) in ('00001140', '00000394')
                                  AND code_currency = '978')) AS "eur"
                FROM   dual`
  }

  customerFundsQuery = () => {
    return `SELECT ROUND((SELECT SUM(saldo_out)
              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                    saldo_out
                             FROM   ibs.saldo@iabs sl
                             WHERE  sl.account_code = ac.code
                               AND sl.oper_day < DATE '${this.date}'
                               AND ROWNUM = 1) AS saldo_out
                     FROM   ibs.accounts@iabs AC
                     WHERE  code_coa = '22613'
                       AND code_currency = '000'))/POWER(10, 8), 2) AS "uzs",
                       ROUND((SELECT SUM(saldo_out)
                              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                    saldo_out
                                             FROM   ibs.saldo@iabs sl
                                             WHERE  sl.account_code = ac.code
                                               AND sl.oper_day < DATE '${this.date}'
                                               AND ROWNUM = 1) AS saldo_out
                                     FROM   ibs.accounts@iabs AC
                                     WHERE  code_coa = '22613'
                                       AND code_currency = '156'))/POWER(10, 8), 2) AS "cny",
                       ROUND((SELECT SUM(saldo_out)
                              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                    saldo_out
                                             FROM   ibs.saldo@iabs sl
                                             WHERE  sl.account_code = ac.code
                                               AND sl.oper_day < DATE '${this.date}'
                                               AND ROWNUM = 1) AS saldo_out
                                     FROM   ibs.accounts@iabs AC
                                     WHERE  code_coa = '22613'
                                       AND code_currency = '392'))/POWER(10, 8), 2) AS "jpy",
                       ROUND((SELECT SUM(saldo_out)
                              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                    saldo_out
                                             FROM   ibs.saldo@iabs sl
                                             WHERE  sl.account_code = ac.code
                                               AND sl.oper_day < DATE '${this.date}'
                                               AND ROWNUM = 1) AS saldo_out
                                     FROM   ibs.accounts@iabs AC
                                     WHERE  code_coa = '22613'
                                       AND code_currency = '398'))/POWER(10, 8), 2) AS "kzt",
                       ROUND((SELECT SUM(saldo_out)
                              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                    saldo_out
                                             FROM   ibs.saldo@iabs sl
                                             WHERE  sl.account_code = ac.code
                                               AND sl.oper_day < DATE '${this.date}'
                                               AND ROWNUM = 1) AS saldo_out
                                     FROM   ibs.accounts@iabs AC
                                     WHERE  code_coa = '22613'
                                       AND code_currency = '643'))/POWER(10, 8), 2) AS "rub",
                       ROUND((SELECT SUM(saldo_out)
                              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                    saldo_out
                                             FROM   ibs.saldo@iabs sl
                                             WHERE  sl.account_code = ac.code
                                               AND sl.oper_day < DATE '${this.date}'
                                               AND ROWNUM = 1) AS saldo_out
                                     FROM   ibs.accounts@iabs AC
                                     WHERE  code_coa = '22613'
                                       AND code_currency = '756'))/POWER(10, 8), 2) AS "chf",
                       ROUND((SELECT SUM(saldo_out)
                              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                    saldo_out
                                             FROM   ibs.saldo@iabs sl
                                             WHERE  sl.account_code = ac.code
                                               AND sl.oper_day < DATE '${this.date}'
                                               AND ROWNUM = 1) AS saldo_out
                                     FROM   ibs.accounts@iabs AC
                                     WHERE  code_coa = '22613'
                                       AND code_currency = '826'))/POWER(10, 8), 2) AS "gbp",
                       ROUND((SELECT SUM(saldo_out)
                              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                    saldo_out
                                             FROM   ibs.saldo@iabs sl
                                             WHERE  sl.account_code = ac.code
                                               AND sl.oper_day < DATE '${this.date}'
                                               AND ROWNUM = 1) AS saldo_out
                                     FROM   ibs.accounts@iabs AC
                                     WHERE  code_coa = '22613'
                                       AND code_currency = '840'))/POWER(10, 8), 2) AS "usd",
                       ROUND((SELECT SUM(saldo_out)
                          FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                saldo_out
                                         FROM   ibs.saldo@iabs sl
                                         WHERE  sl.account_code = ac.code
                                           AND sl.oper_day < DATE '${this.date}'
                                           AND ROWNUM = 1) AS saldo_out
                                 FROM   ibs.accounts@iabs AC
                                 WHERE  code_coa = '22613'
                                   AND code_currency = '978'))/POWER(10, 8), 2) AS "eur"
                FROM   DUAL`
  }

  inner_bank_deposits(...args: ICorrespondentRow[]) {
    const [uzs, cny, jpy, kzt, rub, chf, gbp, usd, eur] = this.currencyNames.map(c =>
      this.getTotal(c, ...args)
    )
    return {
      count: '-',
      indicatorName: 'Межбанковские депозиты (10521, 10531, 10541)',
      uzs,
      cny,
      jpy,
      kzt,
      rub,
      chf,
      gbp,
      usd,
      eur,
      isTableHead: true
    }
  } /* Межбанковские депозиты (10521, 10531, 10541) */

  async agro_bank() {
    return await this.getOneRow('-', 'Agrobank.Uzbekistan', '', this.agroBankQuery)
  } /* Agrobank.Uzbekistan */

  liq_assets_total(...args: ICorrespondentRow[]) {
    const [uzs, cny, jpy, kzt, rub, chf, gbp, usd, eur] = this.currencyNames.map(c =>
      this.getTotal(c, ...args)
    )
    return {
      count: '-',
      indicatorName: 'Всего ликвидные средства',
      uzs,
      cny,
      jpy,
      kzt,
      rub,
      chf,
      gbp,
      usd,
      eur,
      isTableHead: true
    }
  } /* Всего ликвидные средства */

  async accounts_settlement() {
    return await this.getOneRow(
      '-',
      'Расчеты с клиентами - 29801',
      '',
      super.formatQuery.bind(this, '29801')
    )
  } /* Расчеты с клиентами - 29801 */

  async customer_funds() {
    return await this.getOneRow(
      '-',
      'Cредства клиентов для конвертации - 22613',
      '',
      this.customerFundsQuery
    )
  } /* Cредства клиентов для конвертации - 22613 */

  async getRows(others?: ICorrespondentRow[]): Promise<ICorrespondentRow[]> {
    const innerBankPromises = this.innerBanks.map(({ name, code }) =>
      this.getOneRow('-', name, code, null)
    )
    const [innerBanks, customerFunds, agroBank, accountsSettlement] = await Promise.all([
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
