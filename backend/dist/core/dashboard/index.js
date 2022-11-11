"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardMonthlyData = exports.getCreditData = exports.getFcrbData = void 0;
const d_correspondent_1 = require("./d-correspondent");
const d_currency_position_1 = require("./d-currency-position");
const deposits_1 = require("./deposits");
const d_liquidity_1 = require("./d-liquidity");
const currency_rates_1 = require("./currency-rates");
const bank_limits_1 = require("./bank-limits");
const fcrb_1 = require("./fcrb");
const credit_data_1 = require("./credit-data");
const dashboard_monthly_1 = require("./dashboard-monthly");
const dashboard_monthly_2 = require("./dashboard-monthly");
const getDashboardData = async (date, oracleService, configOptions, httpService) => {
    const [dashboardCorrespondent, [currencyPosition, position], [timeDeposits, currencyMfi, currencyTimeDeposits, interbankDeposits, fundingStructure, currencyMBD], [vla, lcr, nsfr], [cbRate, legalEntitiesRates, individualsRates, last90Rates], [foreignBanks, localBanks]] = await Promise.all([
        new d_correspondent_1.DashboardCorrespondent(date, oracleService).getRows(),
        new d_currency_position_1.DashboardCurrencyPosition(date, oracleService).getRows(),
        new deposits_1.Deposits(date, oracleService).getRows(),
        new d_liquidity_1.DashboardLiquidity(date, oracleService).getRows(),
        new currency_rates_1.CurrencyRates(date, oracleService, configOptions, httpService).getRows(),
        new bank_limits_1.BankLimits(oracleService).getRows()
    ]);
    const bankLimits = { foreignBanks, localBanks };
    const dashboardCurrencyPosition = { currencyPosition, position };
    const currencyRates = { cbRate, legalEntitiesRates, individualsRates, last90Rates };
    return {
        dashboardCorrespondent,
        dashboardCurrencyPosition,
        timeDeposits,
        currencyMfi,
        currencyTimeDeposits,
        interbankDeposits,
        fundingStructure,
        currencyMBD,
        vla,
        lcr,
        nsfr,
        currencyRates,
        bankLimits
    };
};
const getFcrbData = async (date, oracleService) => {
    const [mfiData, treasuryData, retailData, centralizedResourceBaseData, portfolioData] = await new fcrb_1.Fcrb(date, oracleService).getRows();
    return { mfiData, treasuryData, retailData, centralizedResourceBaseData, portfolioData };
};
exports.getFcrbData = getFcrbData;
const getCreditData = async (date, oracleService) => {
    const [creditPart, disaggregatedByTime, issuedCredits] = await new credit_data_1.CreditData(date, oracleService).getRows();
    return { creditPart, disaggregatedByTime, issuedCredits };
};
exports.getCreditData = getCreditData;
const getDashboardMonthlyData = async (firstDate, secondDate, oracleService) => {
    const [capital, liquidity] = await new dashboard_monthly_1.DashboardMonthly(firstDate, secondDate, oracleService).getRows();
    const riskPart = await new dashboard_monthly_2.RiskPart(firstDate, secondDate, oracleService).getRows();
    return {
        capital,
        liquidity,
        riskPart
    };
};
exports.getDashboardMonthlyData = getDashboardMonthlyData;
exports.default = getDashboardData;
//# sourceMappingURL=index.js.map