"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeDepositsBase = void 0;
const base_1 = require("../../base");
const date_fns_1 = require("date-fns");
const TDC_base_1 = require("../time-depo-clients/TDC.base");
class TimeDepositsBase extends base_1.Base {
    constructor() {
        super(...arguments);
        this.monthFirstDate = (0, date_fns_1.format)(new Date(this.date), 'yyyy-MM-01');
    }
    formatQuery() {
        return `SELECT FILIAL_NAME                                               AS "filialName",
                   NVL(YEAR_BEGIN, 0)                                        AS "yearBegin",
                   NVL(MONTH_BEGIN, 0)                                       AS "monthBegin",
                   NVL(SELECTED_DATE, 0)                                     AS "selectedDate",
                   NVL(SELECTED_DATE - YEAR_BEGIN, 0)                        AS "changeFromYB",
                   NVL(TRUNC(SELECTED_DATE / YEAR_BEGIN, 2) * 100 - 100, 0)  AS "changeFromYBPercent",
                   NVL(SELECTED_DATE - MONTH_BEGIN, 0)                       AS "changeFromMB" ,
                   NVL(TRUNC(SELECTED_DATE / MONTH_BEGIN, 2) * 100 - 100, 0) AS "changeFromMBPercent" ,
                   COUNT_IN_DATE                                             AS "countDate",
                   NVL(SUM_IN_DATE, 0)                                       AS "sumInDate",
                   COUNT_IN_MONTH                                            AS "countInMonth",
                   NVL(SUM_IN_MONTH, 0)                                      AS "sumInMonth"
            FROM (SELECT FLS.FILIAL_NAME                                           FILIAL_NAME,
                         YEAR_BEGIN,
                         MONTH_BEGIN,
                         SELECTED_DATE,
                         (SELECT COUNT(*)
                          FROM TIME_DEPO_CLIENTS
                          WHERE TO_DATE(DATE_END, 'DD.MM.YYYY') = DATE '${this.date}'
                            AND FILIAL_NAME = FLS.FILIAL_NAME
                            AND OPER_DAY = (SELECT MAX(OPER_DAY)
                                            FROM TIME_DEPO_CLIENTS
                                            WHERE OPER_DAY < DATE '${this.date}')) COUNT_IN_DATE,
                         (SELECT TRUNC(SUM(SALDO_EQUIVALENT_OUT / POWER(10, 6)), 1)
                          FROM TIME_DEPO_CLIENTS
                          WHERE TO_DATE(DATE_END, 'DD.MM.YYYY') = DATE '${this.date}'
                            AND FILIAL_NAME = FLS.FILIAL_NAME
                            AND OPER_DAY = (SELECT MAX(OPER_DAY)
                                            FROM TIME_DEPO_CLIENTS
                                            WHERE OPER_DAY < DATE '${this.date}')) SUM_IN_DATE,
                         (SELECT COUNT(*)
                          FROM TIME_DEPO_CLIENTS
                          WHERE TO_CHAR(DATE_END, 'MM.YYYY') = TO_CHAR(DATE '${this.date}', 'MM.YYYY')
                            AND FILIAL_NAME = FLS.FILIAL_NAME
                            AND OPER_DAY = (SELECT MAX(OPER_DAY)
                                            FROM TIME_DEPO_CLIENTS
                                            WHERE OPER_DAY < DATE '${this.date}')) COUNT_IN_MONTH,
                         (SELECT TRUNC(SUM(SALDO_EQUIVALENT_OUT) / POWER(10, 6), 1)
                          FROM TIME_DEPO_CLIENTS
                          WHERE TO_CHAR(DATE_END, 'MM.YYYY') = TO_CHAR(DATE '${this.date}', 'MM.YYYY')
                            AND FILIAL_NAME = FLS.FILIAL_NAME
                            AND OPER_DAY = (SELECT MAX(OPER_DAY)
                                            FROM TIME_DEPO_CLIENTS
                                            WHERE OPER_DAY < DATE '${this.date}')) SUM_IN_MONTH
                  FROM (SELECT UNIQUE FILIAL_NAME FROM TIME_DEPO_CLIENTS) FLS
                           LEFT JOIN (SELECT FILIAL_NAME, ROUND(SUM(SALDO_EQUIVALENT_OUT) / POWER(10, 6), 1) YEAR_BEGIN
                                      FROM (SELECT * FROM TIME_DEPO_CLIENTS ORDER BY OPER_DAY DESC)
                                      WHERE OPER_DAY = (SELECT MIN(OPER_DAY) YEAR_BEGIN
                                                        FROM TIME_DEPO_CLIENTS
                                                        WHERE TO_CHAR(OPER_DAY, 'YYYY') = TO_CHAR(DATE '${this.date}', 'YYYY'))
                                      GROUP BY FILIAL_NAME) YB ON FLS.FILIAL_NAME = YB.FILIAL_NAME
                           LEFT JOIN (SELECT FILIAL_NAME,
                                             ROUND(SUM(SALDO_EQUIVALENT_OUT) / POWER(10, 6), 1) MONTH_BEGIN
                                      FROM (SELECT * FROM TIME_DEPO_CLIENTS ORDER BY OPER_DAY DESC)
                                      WHERE OPER_DAY = (SELECT MIN(OPER_DAY) MONTH_BEGIN
                                                        FROM TIME_DEPO_CLIENTS
                                                        WHERE TO_CHAR(OPER_DAY, 'YYYY.MM') =
                                                              TO_CHAR(DATE '${this.date}', 'YYYY.MM'))
                                      GROUP BY FILIAL_NAME) MB ON FLS.FILIAL_NAME = MB.FILIAL_NAME
                           LEFT JOIN (SELECT FILIAL_NAME, ROUND(SUM(SALDO_EQUIVALENT_OUT) / POWER(10, 6), 1) SELECTED_DATE
                                      FROM (SELECT * FROM TIME_DEPO_CLIENTS ORDER BY OPER_DAY DESC)
                                      WHERE OPER_DAY = (SELECT MAX(OPER_DAY)
                                                        FROM TIME_DEPO_CLIENTS
                                                        WHERE OPER_DAY < DATE '${this.date}')
                                      GROUP BY FILIAL_NAME) SD ON FLS.FILIAL_NAME = SD.FILIAL_NAME)
    `;
    }
    async getCurrencyRate(currencyCode = '840', date) {
        const { currencyRate } = await this.oracleService.executeQuery(`SELECT equival as "currencyRate" FROM ibs.s_rate_cur@iabs
                       WHERE date_cross<= DATE '${date || this.date}'-1 AND
                             code='${currencyCode}' and ROWNUM=1 ORDER BY DATE_CROSS DESC`);
        return currencyRate;
    }
    async getSumByCurrency(array = [], date) {
        const usdCurrency = await this.getCurrencyRate('840', date);
        const eurCurrency = await this.getCurrencyRate('978', date);
        const [uzs, usd, eur] = ['000', '840', '978'].map(currency => array.reduce((acc, val) => {
            if (val['currencyCode'] === currency) {
                acc += val['saldoOut'];
            }
            return acc;
        }, 0));
        return [uzs, usd * usdCurrency, eur * eurCurrency];
    }
    async getRows() {
        const TdcInDate = await new TDC_base_1.TimeDepoClientsBase(this.date, this.oracleService).getRows();
        const TdcInMonthBegin = await new TDC_base_1.TimeDepoClientsBase(this.monthFirstDate, this.oracleService).getRows();
        const currentBalance = await this.getSumByCurrency(TdcInDate);
        const balanceInMonthBegin = await this.getSumByCurrency(TdcInMonthBegin, this.monthFirstDate);
        const tableData = await this.getDataInDates('1=1', undefined, true);
        return [currentBalance, balanceInMonthBegin, tableData];
    }
}
exports.TimeDepositsBase = TimeDepositsBase;
//# sourceMappingURL=time-deposits.base.js.map