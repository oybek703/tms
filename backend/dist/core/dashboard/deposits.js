"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deposits = void 0;
const base_1 = require("../base");
class Deposits extends base_1.Base {
    constructor() {
        super(...arguments);
        this.timeDepositsQuery = () => {
            return `SELECT TRUNC((USD + EUR + JPY) / POWER(10, 11), 2) AS "others",
                   TRUNC(UZS / POWER(10, 11), 2)                  "uzs"
            FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
            WHERE ROLE = 'T_D'
              AND OPER_DAY <= DATE '${this.date}'
              AND ROWNUM = 1`;
        };
        this.currencyMfiQuery = () => {
            return `SELECT
                    TRUNC(SUM(UZS)/POWER(10, 11), 2) "uzs",
                    TRUNC(SUM(USD)/POWER(10, 11), 2) "usd",
                    TRUNC(SUM(EUR)/POWER(10, 11), 2) "eur",
                    TRUNC(SUM(JPY)/POWER(10, 11), 2) "jpy"
                FROM DASHBOARD_DEPOSIT
                WHERE OPER_DAY = DATE '${this.date}' AND ROLE IN ('IFI_short', 'IFI_long')`;
        };
        this.currencyTimeDepositsQuery = () => {
            return `SELECT TRUNC(UZS/POWER(10, 11), 2) "uzs",
                       TRUNC(USD/POWER(10, 11), 2) "usd",
                       TRUNC(EUR/POWER(10, 11), 2) "eur"
                FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                WHERE ROLE='T_D' AND OPER_DAY<=DATE '${this.date}' AND ROWNUM=1`;
        };
        this.interbankDepositsQuery = () => {
            return `SELECT (SELECT ROUND((UZS + USD + EUR + JPY) / POWER(10, 9), 2)
                    FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                    WHERE ROLE = 'Land'
                      AND OPER_DAY <= DATE '${this.date}'
                      AND ROWNUM = 1) AS "borrow",
                   (SELECT ROUND((UZS + USD + EUR + JPY) / POWER(10, 9), 2)
                    FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                    WHERE ROLE = 'Borrow'
                      AND OPER_DAY <= DATE '${this.date}'
                      AND ROWNUM = 1) AS "land"
            FROM DUAL`;
        };
        this.fundingStructureQuery = () => {
            return `SELECT ((SELECT ROUND((UZS + USD + EUR + JPY) / POWER(10, 9), 2)
                     FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                     WHERE ROLE = 'Land'
                       AND OPER_DAY <= DATE '${this.date}'
                       AND ROWNUM = 1) + (SELECT ROUND((UZS + USD + EUR + JPY) / POWER(10, 9), 2)
                                          FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                                          WHERE ROLE = 'Borrow'
                                            AND OPER_DAY <= DATE '${this.date}'
                                            AND ROWNUM = 1)) AS "mbd",
                   (SELECT TRUNC((USD + EUR + JPY + UZS) / POWER(10, 11), 2)
                    FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                    WHERE ROLE = 'T_D'
                      AND OPER_DAY <= DATE '${this.date}'
                      AND ROWNUM = 1)                        AS "td",
                   (SELECT TRUNC(SUM(UZS + USD + EUR + JPY) / POWER(10, 11), 2)
                    FROM DASHBOARD_DEPOSIT
                    WHERE OPER_DAY = DATE '${this.date}'
                      AND ROLE = 'IFI_short')                AS "mfiShort",
                   (SELECT TRUNC(SUM(UZS + USD + EUR + JPY) / POWER(10, 11), 2)
                    FROM DASHBOARD_DEPOSIT
                    WHERE OPER_DAY = DATE '${this.date}'
                      AND ROLE = 'IFI_long')                 AS "mfiLong"
            FROM DUAL`;
        };
        this.currencyMBDQuery = () => {
            return `SELECT (SELECT ROUND(UZS / POWER(10, 9), 2)
                    FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                    WHERE ROLE = 'Borrow'
                      AND OPER_DAY <= DATE '${this.date}'
                      AND ROWNUM = 1) AS "uzs",
                   (SELECT ROUND(USD / POWER(10, 9), 2)
                    FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                    WHERE ROLE = 'Borrow'
                      AND OPER_DAY <= DATE '${this.date}'
                      AND ROWNUM = 1) AS "usd",
                   (SELECT ROUND(EUR / POWER(10, 9), 2)
                    FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                    WHERE ROLE = 'Borrow'
                      AND OPER_DAY <= DATE '${this.date}'
                      AND ROWNUM = 1) AS "eur"
            FROM DUAL`;
        };
    }
    formatQuery(whereQuery) {
        return '';
    }
    async time_deposits() {
        const { others, uzs } = await this.getDataInDates(undefined, this.timeDepositsQuery);
        return [others, uzs].map(v => Number(v || 0).toFixed(2));
    }
    async currency_mfi() {
        const { uzs, jpy, usd, eur } = await this.getDataInDates(undefined, this.currencyMfiQuery);
        return [uzs, jpy, usd, eur].map(v => Number(v || 0).toFixed(2));
    }
    async currency_time_deposits() {
        const { uzs, usd, eur } = await this.getDataInDates(undefined, this.currencyTimeDepositsQuery);
        return [uzs, usd, eur].map(v => Number(v || 0).toFixed(2));
    }
    async interbank_deposits() {
        const { land, borrow } = await this.getDataInDates(undefined, this.interbankDepositsQuery);
        return [land, borrow].map(v => Number(v || 0).toFixed(2));
    }
    async funding_structure() {
        const { mbd, td, mfiLong, mfiShort } = await this.getDataInDates(undefined, this.fundingStructureQuery);
        return [mbd, td, mfiLong, mfiShort].map(v => Number(v || 0).toFixed(2));
    }
    async currency_mbd() {
        const { uzs, usd, eur } = await this.getDataInDates(undefined, this.currencyMBDQuery);
        return [uzs, usd, eur].map(v => Number(v || 0).toFixed(2));
    }
    async getRows() {
        const [timeDeposits, currencyMfi, currencyTimeDeposits, interbankDeposits, fundingStructure, currencyMBD] = await Promise.all([
            this.time_deposits(),
            this.currency_mfi(),
            this.currency_time_deposits(),
            this.interbank_deposits(),
            this.funding_structure(),
            this.currency_mbd()
        ]);
        return [
            timeDeposits,
            currencyMfi,
            currencyTimeDeposits,
            interbankDeposits,
            fundingStructure,
            currencyMBD
        ];
    }
}
exports.Deposits = Deposits;
//# sourceMappingURL=deposits.js.map