import { OracleService } from '../../../oracle/oracle.service'
import { CorrespondentBase } from './correspondent.base'
import { ICorrespondentRow } from './correspondent.interface'

export class CurrencyRate extends CorrespondentBase {
  isExactDay = this.currenState ? '=' : ''

  constructor(date: Date, oracleService: OracleService, private currenState = false) {
    super(date, oracleService)
  }

  currencyRateQuery = () => {
    return `SELECT (SELECT equival
        FROM   ibs.s_rate_cur@iabs
        WHERE  date_cross = (SELECT MAX(date_cross)
                             FROM   ibs.s_rate_cur@iabs
                             WHERE  code = '156'
                               AND date_cross <${this.isExactDay}DATE '${this.date}'
                               AND ROWNUM = 1)
          AND code = '156') AS "cny",
                       (SELECT equival
        FROM   ibs.s_rate_cur@iabs
        WHERE  date_cross = (SELECT MAX(date_cross)
                             FROM   ibs.s_rate_cur@iabs
                             WHERE  code = '392'
                               AND date_cross <${this.isExactDay}DATE '${this.date}'
                               AND ROWNUM = 1)
          AND code = '392') AS "jpy",
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '398'
                                               AND date_cross <${this.isExactDay}DATE '${this.date}'
                                               AND ROWNUM = 1)
                          AND code = '398') AS "kzt",
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '643'
                                               AND date_cross <${this.isExactDay}DATE'${this.date}'
                                               AND ROWNUM = 1)
                          AND code = '643') AS "rub",
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '756'
                                               AND date_cross <${this.isExactDay}DATE '${this.date}'
                                               AND ROWNUM = 1)
                          AND code = '756') AS "chf",
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '840'
                                               AND date_cross <${this.isExactDay}DATE '${this.date}'
                                               AND ROWNUM = 1)
                          AND code = '826') AS "gbp",
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '826'
                                               AND date_cross <${this.isExactDay}DATE '${this.date}'
                                               AND ROWNUM = 1)
                          AND code = '840') AS "usd",
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '978'
                                               AND date_cross <${this.isExactDay}DATE'${this.date}'
                                               AND ROWNUM = 1)
                          AND code = '978') AS "eur"
                FROM   dual`
  }

  rateChangeQuery = () => {
    return `SELECT (SELECT equival
                FROM   ibs.s_rate_cur@iabs
                WHERE  date_cross = (SELECT
                                         MAX(date_cross)
                                     FROM ibs.s_rate_cur@iabs
                                     WHERE date_cross <${this.isExactDay}DATE '${this.date}')
                  AND code = '156')-(SELECT equival
                                     FROM   ibs.s_rate_cur@iabs
                                     WHERE  date_cross = (SELECT
                                                              MAX(date_cross)
                                                          FROM ibs.s_rate_cur@iabs
                                                          WHERE date_cross < (SELECT
                                                                                  MAX(date_cross)
                                                                              FROM ibs.s_rate_cur@iabs
                                                        WHERE date_cross <${this.isExactDay}DATE '${this.date}'))
                                       AND code = '156') AS "cny", 
                               (SELECT equival
                FROM   ibs.s_rate_cur@iabs
                WHERE  date_cross = (SELECT
                                         MAX(date_cross)
                                     FROM ibs.s_rate_cur@iabs
                                     WHERE date_cross <${this.isExactDay}DATE '${this.date}')
                  AND code = '392')-(SELECT equival
                                     FROM   ibs.s_rate_cur@iabs
                                     WHERE  date_cross = (SELECT
                                                              MAX(date_cross)
                                                          FROM ibs.s_rate_cur@iabs
                                                          WHERE date_cross < (SELECT
                                                                                  MAX(date_cross)
                                                                              FROM ibs.s_rate_cur@iabs
                                     WHERE date_cross <${this.isExactDay}DATE '${this.date}'))
                                       AND code = '392') AS "jpy",
                               (SELECT equival
                                FROM   ibs.s_rate_cur@iabs
                                WHERE  date_cross = (SELECT
                                                         MAX(date_cross)
                                                     FROM ibs.s_rate_cur@iabs
                                                     WHERE date_cross <${this.isExactDay}DATE '${this.date}')
                                  AND code = '398')-(SELECT equival
                                                     FROM   ibs.s_rate_cur@iabs
                                                     WHERE  date_cross = (SELECT
                                                                              MAX(date_cross)
                                                                          FROM ibs.s_rate_cur@iabs
                                                                          WHERE date_cross < (SELECT
                                                                                                  MAX(date_cross)
                                                                                              FROM ibs.s_rate_cur@iabs
                                     WHERE date_cross <${this.isExactDay}DATE '${this.date}'))
                                                       AND code = '398') AS "kzt",
                               (SELECT equival
                                FROM   ibs.s_rate_cur@iabs
                                WHERE  date_cross = (SELECT
                                                         MAX(date_cross)
                                                     FROM ibs.s_rate_cur@iabs
                                                     WHERE date_cross <${this.isExactDay}DATE '${this.date}')
                                  AND code = '643')-(SELECT equival
                                                     FROM   ibs.s_rate_cur@iabs
                                                     WHERE  date_cross = (SELECT
                                                                              MAX(date_cross)
                                                                          FROM ibs.s_rate_cur@iabs
                                                                          WHERE date_cross < (SELECT
                                                                                                  MAX(date_cross)
                                                                                              FROM ibs.s_rate_cur@iabs
                                      WHERE date_cross <${this.isExactDay}DATE '${this.date}'))
                                                       AND code = '643') AS "rub",
                               (SELECT equival
                                FROM   ibs.s_rate_cur@iabs
                                WHERE  date_cross = (SELECT
                                                         MAX(date_cross)
                                                     FROM ibs.s_rate_cur@iabs
                                                     WHERE date_cross <${this.isExactDay}DATE '${this.date}')
                                  AND code = '756')-(SELECT equival
                                                     FROM   ibs.s_rate_cur@iabs
                                                     WHERE  date_cross = (SELECT
                                                                              MAX(date_cross)
                                                                          FROM ibs.s_rate_cur@iabs
                                                                          WHERE date_cross < (SELECT
                                                                                                  MAX(date_cross)
                                                                                              FROM ibs.s_rate_cur@iabs
                                       WHERE date_cross <${this.isExactDay}DATE '${this.date}'))
                                                       AND code = '756') AS "chf",
                               (SELECT equival
                                FROM   ibs.s_rate_cur@iabs
                                WHERE  date_cross = (SELECT
                                                         MAX(date_cross)
                                                     FROM ibs.s_rate_cur@iabs
                                                     WHERE date_cross <${this.isExactDay}DATE '${this.date}')
                                  AND code = '826')-(SELECT equival
                                                     FROM   ibs.s_rate_cur@iabs
                                                     WHERE  date_cross = (SELECT
                                                                              MAX(date_cross)
                                                                          FROM ibs.s_rate_cur@iabs
                                                                          WHERE date_cross < (SELECT
                                                                                                  MAX(date_cross)
                                                                                              FROM ibs.s_rate_cur@iabs
                                       WHERE date_cross <${this.isExactDay}DATE '${this.date}'))
                                                       AND code = '826') AS "gbp",
                               (SELECT equival
                                FROM   ibs.s_rate_cur@iabs
                                WHERE  date_cross = (SELECT
                                                         MAX(date_cross)
                                                     FROM ibs.s_rate_cur@iabs
                                                     WHERE date_cross <${this.isExactDay}DATE '${this.date}')
                                  AND code = '840')-(SELECT equival
                                                     FROM   ibs.s_rate_cur@iabs
                                                     WHERE  date_cross = (SELECT
                                                                              MAX(date_cross)
                                                                          FROM ibs.s_rate_cur@iabs
                                                                          WHERE date_cross < (SELECT
                                                                                                  MAX(date_cross)
                                                                                              FROM ibs.s_rate_cur@iabs
                                        WHERE date_cross <${this.isExactDay}DATE '${this.date}'))
                                                       AND code = '840') AS "usd",
                               (SELECT equival
                                FROM   ibs.s_rate_cur@iabs
                                WHERE  date_cross = (SELECT
                                                         MAX(date_cross)
                                                     FROM ibs.s_rate_cur@iabs
                                                     WHERE date_cross <${this.isExactDay}DATE '${this.date}')
                                  AND code = '978')-(SELECT equival
                                                     FROM   ibs.s_rate_cur@iabs
                                                     WHERE  date_cross = (SELECT
                                                                              MAX(date_cross)
                                                                          FROM ibs.s_rate_cur@iabs
                                                                          WHERE date_cross < (SELECT
                                                                                                  MAX(date_cross)
                                                                                              FROM ibs.s_rate_cur@iabs
                                        WHERE date_cross <${this.isExactDay}DATE '${this.date}'))
                                                       AND code = '978') AS "eur"
                        FROM   dual`
  }

  async currency_rate() {
    return await this.getOneRow('', 'Курс валют', undefined, this.currencyRateQuery, true)
  } /* Курс валют */

  async rate_change() {
    return await this.getOneRow(
      '',
      'Изменения в течения дня',
      undefined,
      this.rateChangeQuery,
      false,
      true
    )
  } /* Изменения в течения дня */

  async getRows(): Promise<ICorrespondentRow[]> {
    return await Promise.all([this.currency_rate(), this.rate_change()])
  }
}
