"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardCurrencyPosition = void 0;
const base_1 = require("../base");
class DashboardCurrencyPosition extends base_1.Base {
    constructor() {
        super(...arguments);
        this.currencyCodes = [
            { code: '840', label: 'USD' },
            { code: '978', label: 'EUR' },
            { code: '392', label: 'JPY' },
            { code: '826', label: 'GBP' },
            { code: '398', label: 'KZT' },
            { code: '643', label: 'RUB' },
            { code: '756', label: 'CHF' },
            { code: '156', label: 'CNY' }
        ];
        this.positionQuery = () => {
            return `SELECT CURRENCY_CODE                                              AS "currencyCode",
                   DECODE(CURRENCY_CODE, '392', CP.EQUIVAL, CP.EQUIVAL / 100) AS "equival",
                   DECODE(CURRENCY_CODE, '392', RATE.EQUIVAL * CP.EQUIVAL,
                          RATE.EQUIVAL * CP.EQUIVAL / 100)                    AS "sumEquival",
                   TRUNC(RATE.EQUIVAL * CP.EQUIVAL / (SELECT EQUIVAL
                                                      FROM REGULATORYCAPITAL
                                                      WHERE OPER_DAY = (SELECT MAX(OPER_DAY)
                                                                        FROM IBS.DAY_OPERATIONAL@IABS
                                                                        WHERE OPER_DAY < DATE '${this.date}')
                                                        AND ROLE = 'R_C'), 3) AS "percent"
            FROM DASHBOARD_CURRENCYPOSITION CP
                     JOIN IBS.S_RATE_CUR@IABS RATE
                          ON RATE.DATE_CROSS = CP.OPER_DAY
            WHERE RATE.CODE = CP.CURRENCY_CODE
              AND OPER_DAY = DATE '${this.date}'`;
        };
    }
    formatQuery(whereQuery = '840') {
        return `SELECT TRUNC(EQUIVAL / POWER(10, ${whereQuery === '392' ? 6 : 8}), 2) AS "value"
            FROM (SELECT * FROM DASHBOARD_CURRENCYPOSITION ORDER BY OPER_DAY DESC)
            WHERE OPER_DAY <= DATE '${this.date}'
              AND CURRENCY_CODE = ${whereQuery}
              AND ROWNUM = 1`;
    }
    matchLabel(currencyCode) {
        const obj = this.currencyCodes.find(({ code }) => code === currencyCode);
        if (obj)
            return obj['label'];
        return '__NO_LABEL__';
    }
    async getOneRow(whereQuery) {
        const { value } = await this.getDataInDates(whereQuery);
        return Number(value || 0).toFixed(2);
    }
    async getRows() {
        const position = (await this.getDataInDates('', this.positionQuery, true)).map(p => (Object.assign(Object.assign({}, p), { name: this.matchLabel(p['currencyCode']) })));
        const currencyPosition = await Promise.all(this.currencyCodes.map(({ code }) => this.getOneRow(code)));
        return [currencyPosition, position];
    }
}
exports.DashboardCurrencyPosition = DashboardCurrencyPosition;
//# sourceMappingURL=d-currency-position.js.map