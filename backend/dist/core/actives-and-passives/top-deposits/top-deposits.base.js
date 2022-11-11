"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopDepositsBase = void 0;
const base_1 = require("../../base");
class TopDepositsBase extends base_1.Base {
    constructor() {
        super(...arguments);
        this.currencyCodes = ['000', '840', '978'];
        this.codes = ['20200', '20600', '20400', '22602', '22613', '22614'];
        this.accounts = this.codes.reduce((acc, val) => {
            acc[val] = this.currencyCodes.map((currency, index) => ({
                codeCoa: val,
                currency: val === '22614' && index === 0 ? '643' : currency
            }));
            return acc;
        }, {});
        this.topDepositsQuery = (codeCoa, currency) => {
            return () => {
                return `SELECT
                    NAME AS "name", 
                    SALDO_OUT AS "saldoOut", 
                    PERCENT AS "percent"
                FROM TOP_DEPOSITS
                WHERE OPER_DAY=(SELECT MAX(OPER_DAY) FROM TOP_DEPOSITS
                WHERE OPER_DAY<DATE '${this.date}')
                  AND CODE_COA='${codeCoa}' 
                  AND CURRENCY_CODE='${currency}' ORDER BY PERCENT DESC`;
            };
        };
    }
    formatQuery(whereQuery) {
        return '';
    }
    async getOneRow(codeCoa, currency) {
        return await this.getDataInDates(undefined, this.topDepositsQuery(codeCoa, currency), true);
    }
    async getRows() {
        const accountsWithData = {};
        for (const accountsKey in this.accounts) {
            accountsWithData[accountsKey] = await Promise.all(this.accounts[accountsKey].map((a) => this.getOneRow(a.codeCoa, a.currency)));
        }
        return [accountsWithData];
    }
}
exports.TopDepositsBase = TopDepositsBase;
//# sourceMappingURL=top-deposits.base.js.map