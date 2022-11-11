"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorrespondentCurrentData = void 0;
const total_cash_1 = require("./total-cash");
const currency_rate_1 = require("./currency-rate");
const interbank_deposits_1 = require("./interbank-deposits");
const interbank_deposits_current_1 = require("./interbank-deposits-current");
const total_cash_current_1 = require("./total-cash-current");
const currency_rate_current_1 = require("./currency-rate-current");
const getCorrespondentData = async (date, oracleService) => {
    const [total, totalCash] = await new total_cash_1.TotalCash(date, oracleService).getRows();
    const [currencyRate, interbankDeposits] = await Promise.all([
        new currency_rate_1.CurrencyRate(date, oracleService).getRows(),
        new interbank_deposits_1.InterbankDeposits(date, oracleService).getRows(total)
    ]);
    return { currencyRate, totalCash, interbankDeposits };
};
const getCorrespondentCurrentData = async (oracleService) => {
    const currencyRate = await new currency_rate_current_1.CurrencyRateCurrent(oracleService).getRows();
    const [total, totalCash] = await new total_cash_current_1.TotalCashCurrent(oracleService).getRows();
    const interbankDeposits = await new interbank_deposits_current_1.InterbankDepositsCurrent(oracleService).getRows(total);
    return {
        currencyRate,
        totalCash,
        interbankDeposits
    };
};
exports.getCorrespondentCurrentData = getCorrespondentCurrentData;
exports.default = getCorrespondentData;
//# sourceMappingURL=index.js.map