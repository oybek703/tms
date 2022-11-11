"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditData = void 0;
const base_1 = require("../base");
class CreditData extends base_1.Base {
    constructor() {
        super(...arguments);
        this.queries = [`AND CREDIT_STATUS IN (0, 1, 2)`, `AND CREDIT_STATUS = 2`];
        this.currencyCodes = ['000', '840', '978'];
        this.delayedAndToxicQuery = () => {
            return `SELECT (DELAYED + TOXIC) AS "sum"
            FROM ((SELECT TRUNC(SUM(TOTAL_LOAN) / POWER(10, 6), 2) TOXIC
                   FROM CR.VIEW_CREDITS_DWH@RISK
                   WHERE OPER_DAY = DATE '${this.date}'
                     AND CREDIT_STATUS = 1)),
                 (SELECT TRUNC(SUM(OVERDUE_SALDO) / POWER(10, 6), 2) DELAYED
                  FROM CR.VIEW_CREDITS_DWH@RISK
                  WHERE OPER_DAY = DATE '${this.date}')`;
        };
        this.disaggregatedQuery = (termType) => {
            return `SELECT TRUNC(SUM(TOTAL_LOAN) / POWER(10, 6), 2) AS "sum"
            FROM CR.VIEW_CREDITS_DWH@RISK
            WHERE OPER_DAY = DATE '${this.date}'
              AND TERM_LOAN_TYPE = ${termType}`;
        };
        this.issuedCreditsQuery = (codeCurrency) => {
            const power = codeCurrency === '000' ? 9 : 10;
            return `SELECT ROUND(NVL(SUM(DEBIT_EQUIVAL) / POWER(10, ${power}), 0), 2) AS "sum"
            FROM CR.LOANS_ISSUED_DWH@RISK
            WHERE OPER_DAY = (SELECT DECODE((DATE '${this.date}'), TRUNC(SYSDATE, 'DD'),
                                            (SELECT MAX(OPER_DAY) FROM CR.LOANS_ISSUED_DWH@RISK),
                                            DATE '${this.date}')
                              FROM DUAL)
              AND CODE_CURRENCY = ${codeCurrency}`;
        };
    }
    formatQuery(whereQuery = '') {
        return `SELECT TRUNC(SUM(TOTAL_LOAN) / POWER(10, 6), 2) AS "sum"
            FROM CR.VIEW_CREDITS_DWH@RISK
            WHERE OPER_DAY = DATE '${this.date}' ${whereQuery}`;
    }
    async getOneRow(whereQuery, ownQuery) {
        const { sum } = await this.getDataInDates(whereQuery, ownQuery);
        return Number(sum).toFixed(2);
    }
    async issued_credits() {
        return await Promise.all(this.currencyCodes.map(c => this.getOneRow(undefined, this.issuedCreditsQuery.bind(this, c))));
    }
    async standard_credits() {
        return this.getOneRow(`AND CREDIT_STATUS=0`);
    }
    async delayed_and_toxic() {
        return await this.getOneRow(undefined, this.delayedAndToxicQuery);
    }
    async disaggregated_by_time() {
        return await Promise.all([1, 3].map(t => this.getOneRow(undefined, this.disaggregatedQuery.bind(this, t))));
    }
    async getRows() {
        try {
            const mappedPromises = this.queries.map(where => this.getOneRow(where));
            const [disaggregatedByTime, issuedCredits] = await Promise.all([
                this.disaggregated_by_time(),
                this.issued_credits()
            ]);
            const creditPart = await Promise.all([
                ...mappedPromises,
                this.delayed_and_toxic(),
                this.standard_credits()
            ]);
            return [creditPart, disaggregatedByTime, issuedCredits];
        }
        catch (e) {
            console.log(e);
            return new Array(3).fill([]);
        }
    }
}
exports.CreditData = CreditData;
//# sourceMappingURL=credit-data.js.map