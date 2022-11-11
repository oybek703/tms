"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyRateCurrent = void 0;
const currency_rate_1 = require("./currency-rate");
const date_fns_1 = require("date-fns");
class CurrencyRateCurrent extends currency_rate_1.CurrencyRate {
    constructor(oracleService) {
        super(new Date(), oracleService);
        this.currencyRateQuery = () => {
            return `SELECT (SELECT equival
        FROM   ibs.s_rate_cur@iabs
        WHERE  date_cross = (SELECT MAX(date_cross)
                             FROM   ibs.s_rate_cur@iabs
                             WHERE  code = '156'
                               AND date_cross <=DATE '${this.date}'
                               AND ROWNUM = 1)
          AND code = '156') AS "cny",
                       (SELECT equival
        FROM   ibs.s_rate_cur@iabs
        WHERE  date_cross = (SELECT MAX(date_cross)
                             FROM   ibs.s_rate_cur@iabs
                             WHERE  code = '392'
                               AND date_cross <=DATE '${this.date}'
                               AND ROWNUM = 1)
          AND code = '392') AS "jpy",
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '398'
                                               AND date_cross <=DATE '${this.date}'
                                               AND ROWNUM = 1)
                          AND code = '398') AS "kzt",
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '643'
                                               AND date_cross <=DATE'${this.date}'
                                               AND ROWNUM = 1)
                          AND code = '643') AS "rub",
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '756'
                                               AND date_cross <=DATE '${this.date}'
                                               AND ROWNUM = 1)
                          AND code = '756') AS "chf",
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '840'
                                               AND date_cross <=DATE '${this.date}'
                                               AND ROWNUM = 1)
                          AND code = '826') AS "gbp",
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '826'
                                               AND date_cross <=DATE '${this.date}'
                                               AND ROWNUM = 1)
                          AND code = '840') AS "usd",
                       (SELECT equival
                        FROM   ibs.s_rate_cur@iabs
                        WHERE  date_cross = (SELECT MAX(date_cross)
                                             FROM   ibs.s_rate_cur@iabs
                                             WHERE  code = '978'
                                               AND date_cross <=DATE'${this.date}'
                                               AND ROWNUM = 1)
                          AND code = '978') AS "eur"
                FROM   dual`;
        };
        this.rateChangeQuery = () => {
            return `SELECT (SELECT equival
                FROM   ibs.s_rate_cur@iabs
                WHERE  date_cross = (SELECT
                                         MAX(date_cross)
                                     FROM ibs.s_rate_cur@iabs
                                     WHERE date_cross <=DATE '${this.date}')
                  AND code = '156')-(SELECT equival
                                     FROM   ibs.s_rate_cur@iabs
                                     WHERE  date_cross = (SELECT
                                                              MAX(date_cross)
                                                          FROM ibs.s_rate_cur@iabs
                                                          WHERE date_cross < (SELECT
                                                                                  MAX(date_cross)
                                                                              FROM ibs.s_rate_cur@iabs
                                                        WHERE date_cross <=DATE '${this.date}'))
                                       AND code = '156') AS "cny", 
                               (SELECT equival
                FROM   ibs.s_rate_cur@iabs
                WHERE  date_cross = (SELECT
                                         MAX(date_cross)
                                     FROM ibs.s_rate_cur@iabs
                                     WHERE date_cross <=DATE '${this.date}')
                  AND code = '392')-(SELECT equival
                                     FROM   ibs.s_rate_cur@iabs
                                     WHERE  date_cross = (SELECT
                                                              MAX(date_cross)
                                                          FROM ibs.s_rate_cur@iabs
                                                          WHERE date_cross < (SELECT
                                                                                  MAX(date_cross)
                                                                              FROM ibs.s_rate_cur@iabs
                                     WHERE date_cross <=DATE '${this.date}'))
                                       AND code = '392') AS "jpy",
                               (SELECT equival
                                FROM   ibs.s_rate_cur@iabs
                                WHERE  date_cross = (SELECT
                                                         MAX(date_cross)
                                                     FROM ibs.s_rate_cur@iabs
                                                     WHERE date_cross <=DATE '${this.date}')
                                  AND code = '398')-(SELECT equival
                                                     FROM   ibs.s_rate_cur@iabs
                                                     WHERE  date_cross = (SELECT
                                                                              MAX(date_cross)
                                                                          FROM ibs.s_rate_cur@iabs
                                                                          WHERE date_cross < (SELECT
                                                                                                  MAX(date_cross)
                                                                                              FROM ibs.s_rate_cur@iabs
                                     WHERE date_cross <=DATE '${this.date}'))
                                                       AND code = '398') AS "kzt",
                               (SELECT equival
                                FROM   ibs.s_rate_cur@iabs
                                WHERE  date_cross = (SELECT
                                                         MAX(date_cross)
                                                     FROM ibs.s_rate_cur@iabs
                                                     WHERE date_cross <=DATE '${this.date}')
                                  AND code = '643')-(SELECT equival
                                                     FROM   ibs.s_rate_cur@iabs
                                                     WHERE  date_cross = (SELECT
                                                                              MAX(date_cross)
                                                                          FROM ibs.s_rate_cur@iabs
                                                                          WHERE date_cross < (SELECT
                                                                                                  MAX(date_cross)
                                                                                              FROM ibs.s_rate_cur@iabs
                                      WHERE date_cross <=DATE '${this.date}'))
                                                       AND code = '643') AS "rub",
                               (SELECT equival
                                FROM   ibs.s_rate_cur@iabs
                                WHERE  date_cross = (SELECT
                                                         MAX(date_cross)
                                                     FROM ibs.s_rate_cur@iabs
                                                     WHERE date_cross <=DATE '${this.date}')
                                  AND code = '756')-(SELECT equival
                                                     FROM   ibs.s_rate_cur@iabs
                                                     WHERE  date_cross = (SELECT
                                                                              MAX(date_cross)
                                                                          FROM ibs.s_rate_cur@iabs
                                                                          WHERE date_cross < (SELECT
                                                                                                  MAX(date_cross)
                                                                                              FROM ibs.s_rate_cur@iabs
                                       WHERE date_cross <=DATE '${this.date}'))
                                                       AND code = '756') AS "chf",
                               (SELECT equival
                                FROM   ibs.s_rate_cur@iabs
                                WHERE  date_cross = (SELECT
                                                         MAX(date_cross)
                                                     FROM ibs.s_rate_cur@iabs
                                                     WHERE date_cross <=DATE '${this.date}')
                                  AND code = '826')-(SELECT equival
                                                     FROM   ibs.s_rate_cur@iabs
                                                     WHERE  date_cross = (SELECT
                                                                              MAX(date_cross)
                                                                          FROM ibs.s_rate_cur@iabs
                                                                          WHERE date_cross < (SELECT
                                                                                                  MAX(date_cross)
                                                                                              FROM ibs.s_rate_cur@iabs
                                       WHERE date_cross <=DATE '${this.date}'))
                                                       AND code = '826') AS "gbp",
                               (SELECT equival
                                FROM   ibs.s_rate_cur@iabs
                                WHERE  date_cross = (SELECT
                                                         MAX(date_cross)
                                                     FROM ibs.s_rate_cur@iabs
                                                     WHERE date_cross <=DATE '${this.date}')
                                  AND code = '840')-(SELECT equival
                                                     FROM   ibs.s_rate_cur@iabs
                                                     WHERE  date_cross = (SELECT
                                                                              MAX(date_cross)
                                                                          FROM ibs.s_rate_cur@iabs
                                                                          WHERE date_cross < (SELECT
                                                                                                  MAX(date_cross)
                                                                                              FROM ibs.s_rate_cur@iabs
                                        WHERE date_cross <=DATE '${this.date}'))
                                                       AND code = '840') AS "usd",
                               (SELECT equival
                                FROM   ibs.s_rate_cur@iabs
                                WHERE  date_cross = (SELECT
                                                         MAX(date_cross)
                                                     FROM ibs.s_rate_cur@iabs
                                                     WHERE date_cross <=DATE '${this.date}')
                                  AND code = '978')-(SELECT equival
                                                     FROM   ibs.s_rate_cur@iabs
                                                     WHERE  date_cross = (SELECT
                                                                              MAX(date_cross)
                                                                          FROM ibs.s_rate_cur@iabs
                                                                          WHERE date_cross < (SELECT
                                                                                                  MAX(date_cross)
                                                                                              FROM ibs.s_rate_cur@iabs
                                        WHERE date_cross <=DATE '${this.date}'))
                                                       AND code = '978') AS "eur"
                        FROM   dual`;
        };
        this.date = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd');
    }
}
exports.CurrencyRateCurrent = CurrencyRateCurrent;
//# sourceMappingURL=currency-rate-current.js.map