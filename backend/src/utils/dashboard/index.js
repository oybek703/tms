const DashboardCorrespondent = require("./dashboardCorrespondent")
const CreditPart = require("./creditPart")
const DashboardCurrencyPosition = require("./dashboardCurrencyPosition")
const Deposits = require("./Deposits")
const DashboardLiquidity = require("./dashboardLiquidity")
const CurrencyRates = require('./currencyRates')

async function getDashboardData(date) {
    const [
        dashboardCorrespondent,
        {creditPart1, disaggregatedByTime, issuedCredits},
        dashboardCurrencyPosition,
        {timeDeposits, currencyMfi,
            currencyTimeDeposits, interbankDeposits,
            fundingStructure, currencyMBD},
        {vla, lcr, nsfr},
        currencyRates
    ] = await Promise.all([
        new DashboardCorrespondent(date).getRows(),
        new CreditPart(date).getRows(),
        new DashboardCurrencyPosition(date).getRows(),
        new Deposits(date).getRows(),
        new DashboardLiquidity(date).getRows(),
        new CurrencyRates(date).getRows()
    ])
    return {
        dashboardCorrespondent,
        creditPart:creditPart1,
        disaggregatedByTime,
        dashboardCurrencyPosition,
        timeDeposits,
        currencyMfi,
        currencyTimeDeposits,
        issuedCredits,
        interbankDeposits,
        fundingStructure,
        currencyMBD,
        vla,
        lcr,
        nsfr,
        currencyRates
    }
}

module.exports = getDashboardData