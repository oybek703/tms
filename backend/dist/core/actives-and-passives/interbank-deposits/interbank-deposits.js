"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterbankDeposits = void 0;
const IB_base_1 = require("./IB.base");
class InterbankDeposits extends IB_base_1.InterbankDepositsBase {
    constructor() {
        super(...arguments);
        this.landCodes = `CODE_COA IN ('10597', '10397', '10521', '10531', '10541', '10321', '10331')`;
        this.borrowCodes = `CODE_COA IN ('21010', '21022', '21032', '21042')`;
        this.interbankDepositsQuery = (currencyCode, codeCoa) => {
            return `SELECT
                       MAX(NAME_BANK) AS "bankName",
                       SUM(SALDO_OUT) AS "saldoOut",
                       MIN(BEGIN_DATE) AS "beginDate",
                       MAX(END_DATE) AS "endDate",
                       ROUND(AVG(PERCENT_RATE)) AS "percentRate",
                       SUM(FOR_DAY) AS "forDay",
                       SUM(FOR_PERIOD) AS "forPeriod",
                       SUM(DAY_COUNT) AS "dayCount",
                       0 AS "percentShare"
                FROM (SELECT
                           NAME_BANK,
                           SALDO_OUT,
                           BEGIN_DATE,
                           END_DATE,
                           PERCENT_RATE,
                           FOR_DAY,
                           (TRUNC(((SALDO_OUT*DAY_COUNT*(PERCENT_RATE/100)/365)), 2)) FOR_PERIOD,
                           DAY_COUNT,
                           SUBSTR(ACCOUNT_CODE, 17, 8) BANK_CODE
                       FROM (SELECT
                                 NAME_BANK,
                                 SALDO_OUT,
                                 (SELECT DECODE(
                                     TO_CHAR(DATE_BEGIN, 'YYYY'),
                                     '2099',
                                     TO_CHAR(NULL),
                                     TO_CHAR(DATE_BEGIN, 'YYYY.MM.DD')
                                     ) FROM DUAL) BEGIN_DATE,
                                 (SELECT DECODE(TO_CHAR(DATE_END, 'YYYY'), '2099', TO_CHAR(0), TO_CHAR(DATE_END, 'YYYY.MM.DD')) FROM DUAL) END_DATE,
                                 PERCENT_RATE,
                                 (TRUNC(SALDO_OUT*(PERCENT_RATE/100)/365, 2)) FOR_DAY,
                                 (SELECT DECODE(TO_CHAR(DATE_END, 'YYYY'), '2099', 0, DATE_END-DATE_BEGIN) FROM DUAL) DAY_COUNT,
                                 ACCOUNT_CODE
                             FROM (SELECT * FROM INTERBANKDEPOSIT ORDER BY OPER_DAY DESC)
                             WHERE OPER_DAY=(SELECT MAX(OPER_DAY) FROM INTERBANKDEPOSIT WHERE OPER_DAY<DATE '${this.date}')
                               AND ${codeCoa} AND CURRENCY_CODE='${currencyCode}'
                             ORDER BY SALDO_OUT DESC)) GROUP BY BANK_CODE`;
        };
    }
    async mapBanks(currencyCode, codeCoa) {
        const allMappedBanks = await this.getDataInDates(undefined, this.interbankDepositsQuery.bind(this, currencyCode, codeCoa), true);
        return this.formatMappedBanks(allMappedBanks);
    }
    async getRows(type) {
        const land = await Promise.all(this.currencyCodes.map(currencyCode => this.mapBanks(currencyCode, this.landCodes)));
        const borrow = await Promise.all(this.currencyCodes.map(currencyCode => this.mapBanks(currencyCode, this.borrowCodes)));
        const fullBorrowData = await new IB_base_1.InterbankDepositsBase(this.date, this.oracleService, 'borrow').getRows();
        const fullLandData = await new IB_base_1.InterbankDepositsBase(this.date, this.oracleService, 'land').getRows();
        switch (type) {
            case 'borrow':
                return borrow;
            case 'land':
                return land;
            case 'fullBorrow':
                return fullBorrowData;
            case 'fullLand':
                return fullLandData;
        }
    }
}
exports.InterbankDeposits = InterbankDeposits;
//# sourceMappingURL=interbank-deposits.js.map