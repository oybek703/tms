"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalcForBase = void 0;
const base_1 = require("../../base");
const date_fns_1 = require("date-fns");
class CalcForBase extends base_1.Base {
    constructor() {
        super(...arguments);
        this.startEndDateQuery = () => {
            return `SELECT FROM_DATE AS "fromDate", END_DATE AS "endDate" FROM FOR_STANDARD
                WHERE DATE '${this.date}'>=FROM_DATE
                  AND DATE '${this.date}'<=END_DATE`;
        };
        this.getDatesBetweenDates = (startDate, endDate) => {
            let dates = [];
            const theDate = new Date(startDate);
            while (theDate <= new Date(endDate)) {
                dates = [...dates, new Date(theDate)];
                theDate.setDate(theDate.getDate() + 1);
            }
            return dates;
        };
    }
    formatQuery(date) {
        const formattedDateValue = (0, date_fns_1.format)(new Date(date), 'dd.MM.yyyy');
        return `SELECT DATE_VALUE AS "date",
                   F_O_R AS "forValue",
                   NVL(CB_STANDARD, 0) AS "cbStandard",
                   NVL(ST_DEVIATION, 0) AS "stDeviation",
                   (SELECT CASE
                               WHEN ST_DEVIATION > 0 THEN ROUND((ST_DEVIATION * 0.135) / 365, 2)
                               ELSE 0
                               END
                    FROM DUAL) AS       "avgConsumption"
            FROM (SELECT DATE_VALUE,
                         F_O_R,
                         CB_STANDARD,
                         (F_O_R - CB_STANDARD) ST_DEVIATION
                  FROM (SELECT '${formattedDateValue}'                            DATE_VALUE,
                               (SELECT CB_STANDARD
                                FROM (SELECT * FROM FOR_STANDARD ORDER BY FROM_DATE)
                                WHERE DATE '${date}' >= FROM_DATE
                                  AND DATE '${date}' <= END_DATE
                                  AND ROWNUM = 1)                   CB_STANDARD,
                               (SELECT ABS(ROUND(SUM(SALDO_OUT) / POWER(10, 5), 2))
                                FROM (SELECT AC.CODE,
                                             (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                     SALDO_OUT
                                              FROM IBS.SALDO@IABS SL
                                              WHERE SL.ACCOUNT_CODE = AC.CODE
                                                AND SL.OPER_DAY <= DATE '${date}'
                                                AND ROWNUM = 1) AS SALDO_OUT
                                      FROM IBS.ACCOUNTS@IABS AC
                                      WHERE CODE_COA = '10301'
                                        AND CODE_CURRENCY = '000')) F_O_R
                        FROM DUAL))`;
    }
    async getDates() {
        const { fromDate, endDate } = await this.getDataInDates('', this.startEndDateQuery);
        return this.getDatesBetweenDates(fromDate, endDate);
    }
    async getOneRow(date) {
        return await this.getDataInDates('', this.formatQuery.bind(this, date));
    }
    async getRows() {
        const dates = await this.getDates();
        return await Promise.all(dates.map(date => {
            const formattedDate = (0, date_fns_1.format)(date, 'dd.MM.yyyy');
            const dbFormattedDate = (0, date_fns_1.format)(date, 'yyyy-MM-dd');
            if (new Date(date) <= new Date(Date.now() - 86400000)) {
                return this.getOneRow(dbFormattedDate);
            }
            return {
                date: formattedDate,
                forValue: 0,
                cbStandard: 0,
                stDeviation: 0,
                avgConsumption: 0
            };
        }));
    }
}
exports.CalcForBase = CalcForBase;
//# sourceMappingURL=calc-for.base.js.map