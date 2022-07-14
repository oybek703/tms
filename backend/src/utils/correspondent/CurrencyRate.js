const CorrespondentMainClass = require('./CorrespondentMainClass')

class CurrencyRate extends CorrespondentMainClass {
    constructor(date, currencyRate = false) {
        super(date)
        this.currencyRate = currencyRate
        this.isExactDay = currencyRate ? '=' : ''
    }

    currencyRateQuery(date) {
        return `SELECT (SELECT equival
        FROM   ibs.s_rate_cur@iabs
        WHERE  date_cross = (SELECT MAX(date_cross)
                             FROM   ibs.s_rate_cur@iabs
                             WHERE  code = '156'
                               AND date_cross <${this.isExactDay}TO_DATE('${date}',
                                                         'DD-MM-YYYY')
                               AND ROWNUM = 1)
          AND code = '156') AS CNY,
                       (SELECT equival
        FROM   ibs.s_rate_cur@iabs
        WHERE  date_cross = (SELECT MAX(date_cross)
                             FROM   ibs.s_rate_cur@iabs
                             WHERE  code = '392'
                               AND date_cross <${this.isExactDay}TO_DATE('${date}',
                                                         'DD-MM-YYYY')
                               AND ROWNUM = 1)
          AND code = '392') AS JPY,
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '398'
                                               AND date_cross <${this.isExactDay}TO_DATE('${date}',
                                                                         'DD-MM-YYYY')
                                               AND ROWNUM = 1)
                          AND code = '398') AS KZT,
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '643'
                                               AND date_cross <${this.isExactDay}TO_DATE('${date}',
                                                                         'DD-MM-YYYY')
                                               AND ROWNUM = 1)
                          AND code = '643') AS RUB,
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '756'
                                               AND date_cross <${this.isExactDay}TO_DATE('${date}',
                                                                         'DD-MM-YYYY')
                                               AND ROWNUM = 1)
                          AND code = '756') AS CHF,
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '840'
                                               AND date_cross <${this.isExactDay}TO_DATE('${date}',
                                                                         'DD-MM-YYYY')
                                               AND ROWNUM = 1)
                          AND code = '826') AS GBP,
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '826'
                                               AND date_cross <${this.isExactDay}TO_DATE('${date}',
                                                                         'DD-MM-YYYY')
                                               AND ROWNUM = 1)
                          AND code = '840') AS USD,
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '978'
                                               AND date_cross <${this.isExactDay}TO_DATE('${date}',
                                                                         'DD-MM-YYYY')
                                               AND ROWNUM = 1)
                          AND code = '978') AS EUR
                FROM   dual`
    }

    rateChangeQuery(date) {
        return `SELECT (SELECT equival
        FROM   ibs.s_rate_cur@iabs
        WHERE  date_cross = (SELECT
                                 MAX(date_cross)
                             FROM ibs.s_rate_cur@iabs
                             WHERE date_cross <${this.isExactDay}TO_DATE('${date}', 'DD-MM-YYYY'))
          AND code = '156')-(SELECT equival
                             FROM   ibs.s_rate_cur@iabs
                             WHERE  date_cross = (SELECT
                                                      MAX(date_cross)
                                                  FROM ibs.s_rate_cur@iabs
                                                  WHERE date_cross < (SELECT
                                                                          MAX(date_cross)
                                                                      FROM ibs.s_rate_cur@iabs
                                                                      WHERE date_cross <${this.isExactDay}TO_DATE('${date}', 'DD-MM-YYYY')))
                               AND code = '156') AS CNY, 
                       (SELECT equival
        FROM   ibs.s_rate_cur@iabs
        WHERE  date_cross = (SELECT
                                 MAX(date_cross)
                             FROM ibs.s_rate_cur@iabs
                             WHERE date_cross <${this.isExactDay}TO_DATE('${date}', 'DD-MM-YYYY'))
          AND code = '392')-(SELECT equival
                             FROM   ibs.s_rate_cur@iabs
                             WHERE  date_cross = (SELECT
                                                      MAX(date_cross)
                                                  FROM ibs.s_rate_cur@iabs
                                                  WHERE date_cross < (SELECT
                                                                          MAX(date_cross)
                                                                      FROM ibs.s_rate_cur@iabs
                                                                      WHERE date_cross <${this.isExactDay}TO_DATE('${date}', 'DD-MM-YYYY')))
                               AND code = '392') AS JPY,
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT
                                                 MAX(date_cross)
                                             FROM ibs.s_rate_cur@iabs
                                             WHERE date_cross <${this.isExactDay}TO_DATE('${date}', 'DD-MM-YYYY'))
                          AND code = '398')-(SELECT equival
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  date_cross = (SELECT
                                                                      MAX(date_cross)
                                                                  FROM ibs.s_rate_cur@iabs
                                                                  WHERE date_cross < (SELECT
                                                                                          MAX(date_cross)
                                                                                      FROM ibs.s_rate_cur@iabs
                                                                                      WHERE date_cross <${this.isExactDay}TO_DATE('${date}', 'DD-MM-YYYY')))
                                               AND code = '398') AS KZT,
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT
                                                 MAX(date_cross)
                                             FROM ibs.s_rate_cur@iabs
                                             WHERE date_cross <${this.isExactDay}TO_DATE('${date}', 'DD-MM-YYYY'))
                          AND code = '643')-(SELECT equival
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  date_cross = (SELECT
                                                                      MAX(date_cross)
                                                                  FROM ibs.s_rate_cur@iabs
                                                                  WHERE date_cross < (SELECT
                                                                                          MAX(date_cross)
                                                                                      FROM ibs.s_rate_cur@iabs
                                                                                      WHERE date_cross <${this.isExactDay}TO_DATE('${date}', 'DD-MM-YYYY')))
                                               AND code = '643') AS RUB,
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT
                                                 MAX(date_cross)
                                             FROM ibs.s_rate_cur@iabs
                                             WHERE date_cross <${this.isExactDay}TO_DATE('${date}', 'DD-MM-YYYY'))
                          AND code = '756')-(SELECT equival
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  date_cross = (SELECT
                                                                      MAX(date_cross)
                                                                  FROM ibs.s_rate_cur@iabs
                                                                  WHERE date_cross < (SELECT
                                                                                          MAX(date_cross)
                                                                                      FROM ibs.s_rate_cur@iabs
                                                                                      WHERE date_cross <${this.isExactDay}TO_DATE('${date}', 'DD-MM-YYYY')))
                                               AND code = '756') AS CHF,
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT
                                                 MAX(date_cross)
                                             FROM ibs.s_rate_cur@iabs
                                             WHERE date_cross <${this.isExactDay}TO_DATE('${date}', 'DD-MM-YYYY'))
                          AND code = '826')-(SELECT equival
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  date_cross = (SELECT
                                                                      MAX(date_cross)
                                                                  FROM ibs.s_rate_cur@iabs
                                                                  WHERE date_cross < (SELECT
                                                                                          MAX(date_cross)
                                                                                      FROM ibs.s_rate_cur@iabs
                                                                                      WHERE date_cross <${this.isExactDay}TO_DATE('${date}', 'DD-MM-YYYY')))
                                               AND code = '826') AS GBP,
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT
                                                 MAX(date_cross)
                                             FROM ibs.s_rate_cur@iabs
                                             WHERE date_cross <${this.isExactDay}TO_DATE('${date}', 'DD-MM-YYYY'))
                          AND code = '840')-(SELECT equival
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  date_cross = (SELECT
                                                                      MAX(date_cross)
                                                                  FROM ibs.s_rate_cur@iabs
                                                                  WHERE date_cross < (SELECT
                                                                                          MAX(date_cross)
                                                                                      FROM ibs.s_rate_cur@iabs
                                                                                      WHERE date_cross <${this.isExactDay}TO_DATE('${date}', 'DD-MM-YYYY')))
                                               AND code = '840') AS USD,
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT
                                                 MAX(date_cross)
                                             FROM ibs.s_rate_cur@iabs
                                             WHERE date_cross <${this.isExactDay}TO_DATE('${date}', 'DD-MM-YYYY'))
                          AND code = '978')-(SELECT equival
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  date_cross = (SELECT
                                                                      MAX(date_cross)
                                                                  FROM ibs.s_rate_cur@iabs
                                                                  WHERE date_cross < (SELECT
                                                                                          MAX(date_cross)
                                                                                      FROM ibs.s_rate_cur@iabs
                                                                                      WHERE date_cross <${this.isExactDay}TO_DATE('${date}', 'DD-MM-YYYY')))
                                               AND code = '978') AS EUR
                FROM   dual`
    }

    async getOneRow(count, state, code_coa, ownQuery, isTableHead = false, isNegative) {
        return super.getOneRow(count, state, false, ownQuery, isTableHead, isNegative)
    }

    async currency_rate() {
        return await this.getOneRow(
            '',
            'Курс валют',
            false,
            this.currencyRateQuery.bind(this),
            true
        )
    }

    async rate_change() {
        return await this.getOneRow(
            '',
            'Изменения в течения дня',
            false,
            this.rateChangeQuery.bind(this),
            false,
            true
        )
    }

    async getRows() {
        const [
            currencyRate,
            rateChange
        ] = await Promise.all([
            this.currency_rate(),
            this.rate_change()
        ])
        return [
            currencyRate,
            rateChange
        ]
    }
}

module.exports = CurrencyRate