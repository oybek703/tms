"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardCorrespondent = void 0;
const base_1 = require("../base");
class DashboardCorrespondent extends base_1.Base {
    constructor() {
        super(...arguments);
        this.terms = [
            { code: '000', image: 'uzs' },
            { code: '840', image: 'usd' },
            { code: '978', image: 'eur' },
            { code: '643', image: 'rub' }
        ];
    }
    formatQuery(whereQuery) {
        return `SELECT EQUIVAL   AS "value",
                   DIFFRENCE AS "differ"
            FROM (SELECT * FROM DASHBOARD_CORRESPONDENT ORDER BY OPER_DAY DESC)
            WHERE CURRENCY_CODE = ${whereQuery}
              AND OPER_DAY <= DATE '${this.date}'
              AND ROWNUM = 1`;
    }
    async getOneRow(whereQuery, image) {
        const { value, differ } = await this.getDataInDates(whereQuery);
        return {
            value: Number(value || 0).toFixed(2),
            differ: Number(differ || 0).toFixed(2),
            image
        };
    }
    async getRows() {
        const termsData = this.terms.map(({ code, image }) => this.getOneRow(code, image));
        return await Promise.all(termsData);
    }
}
exports.DashboardCorrespondent = DashboardCorrespondent;
//# sourceMappingURL=d-correspondent.js.map