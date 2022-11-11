"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterbankDepositsBase = void 0;
const base_1 = require("../../base");
class InterbankDepositsBase extends base_1.Base {
    constructor(date, oracleService, type = 'borrow') {
        super(date, oracleService);
        this.type = type;
        this.currencyCodes = ['000', '840', '978'];
    }
    formatQuery(whereQuery) {
        return `SELECT
                    NAME_BANK AS "bankName",
                    SALDO_OUT "saldoOut",
                    BEGIN_DATE AS "beginDate",
                    END_DATE AS "endDate",
                    PERCENT_RATE AS "percentRate",
                    FOR_DAY AS "forDay",
                    (TRUNC(((SALDO_OUT*DAY_COUNT*(PERCENT_RATE/100)/365)), 2)) AS "forPeriod",
                    DAY_COUNT AS "dayCount",
                    0 AS "percentShare"
                FROM (SELECT
                          NAME_BANK,
                          SALDO_OUT,
                          (SELECT DECODE(TO_CHAR(DATE_BEGIN, 'YYYY'), '2099', TO_CHAR(0), TO_CHAR(DATE_BEGIN, 'DD.MM.YYYY')) FROM DUAL) BEGIN_DATE,
                          (SELECT DECODE(TO_CHAR(DATE_END, 'YYYY'), '2099', TO_CHAR(0), TO_CHAR(DATE_END, 'DD.MM.YYYY')) FROM DUAL) END_DATE,
                          PERCENT_RATE,
                          (TRUNC(SALDO_OUT*(PERCENT_RATE/100)/365, 2)) FOR_DAY,
                          (SELECT DECODE(TO_CHAR(DATE_END, 'YYYY'), '2099', 0, DATE_END-DATE_BEGIN) FROM DUAL) DAY_COUNT
                      FROM (SELECT * FROM INTERBANKDEPOSIT ORDER BY OPER_DAY DESC)
                      WHERE OPER_DAY=(SELECT MAX(OPER_DAY) FROM INTERBANKDEPOSIT WHERE OPER_DAY<DATE '${this.date}') 
                        AND ${this.type === 'borrow'
            ? "CODE_COA IN ('21010', '21022', '21032', '21042')"
            : "CODE_COA IN ('10597', '10397', '10521', '10531', '10541', '10321', '10331')"} 
                        AND CURRENCY_CODE='${whereQuery}'
                      ORDER BY SALDO_OUT DESC)`;
    }
    formatMappedBanks(allMappedBanks) {
        const mappedBanksSum = [...allMappedBanks].reduce((acc, val) => (acc += val['saldoOut']), 0);
        allMappedBanks = allMappedBanks.map(b => {
            b['percentShare'] = +((b['saldoOut'] * 100) / mappedBanksSum).toFixed(1);
            return b;
        });
        const percents = allMappedBanks.map(b => +((b['saldoOut'] * b['percentShare']) / mappedBanksSum).toFixed(1));
        const percentSum = +[...percents].reduce((a, b) => a + b, 0).toFixed(1);
        const forDaySum = +[...allMappedBanks]
            .reduce((acc, val) => (acc += val['forDay']), 0)
            .toFixed(2);
        const forPeriodSum = +[...allMappedBanks]
            .reduce((acc, val) => (acc += val['forPeriod']), 0)
            .toFixed(2);
        return {
            allMappedBanks,
            sumRow: ['Итого', mappedBanksSum, percentSum, forDaySum, forPeriodSum, '100%']
        };
    }
    async mapBanks(currencyCode) {
        const allMappedBanks = await this.getDataInDates(currencyCode, undefined, true);
        return this.formatMappedBanks(allMappedBanks);
    }
    async getRows(type = 'borrow') {
        if (this.type === 'land')
            this.currencyCodes.push('643');
        return await Promise.all(this.currencyCodes.map(this.mapBanks.bind(this)));
    }
}
exports.InterbankDepositsBase = InterbankDepositsBase;
//# sourceMappingURL=IB.base.js.map