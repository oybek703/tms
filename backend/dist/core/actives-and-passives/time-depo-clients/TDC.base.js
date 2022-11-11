"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeDepoClientsBase = void 0;
const base_1 = require("../../base");
class TimeDepoClientsBase extends base_1.Base {
    formatQuery() {
        return `SELECT
                FILIAL_NAME AS "filialName",
                CODE_COA AS "codeCoa",
                CLIENT_NAME AS "clientName",
                TO_CHAR(DATE_BEGIN, 'DD.MM.YYYY') AS "dateBegin",
                TO_CHAR(DATE_END, 'DD.MM.YYYY') AS "dateEnd",
                CURRENCY_CODE AS "currencyCode",
                SALDO_OUT AS "saldoOut",
                SALDO_EQUIVALENT_OUT AS "saldoEquivalentOut",
                PERCENT AS "percent"
            FROM (SELECT * FROM TIME_DEPO_CLIENTS ORDER BY OPER_DAY DESC)
            WHERE OPER_DAY = (SELECT MAX(OPER_DAY)
                              FROM TIME_DEPO_CLIENTS WHERE OPER_DAY<DATE '${this.date}')`;
    }
    async getRows() {
        return await this.getDataInDates('1=1', undefined, true);
    }
}
exports.TimeDepoClientsBase = TimeDepoClientsBase;
//# sourceMappingURL=TDC.base.js.map