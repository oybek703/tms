const CurrencyRate = require("./CurrencyRate")
const TotalCash = require("./TotalCash")
const CorrespondentInterbankDeposits = require("./CorrespondentInterbankDeposits")
const TotalCashCurrent = require('./TotalCashCurrent')
const CorrespondentInterbankDepositsCurrent = require('./CorrespondentInterbankDepositsCurrent')
const LimitOfBanks = require('./LimitOfBanks')

async function getCorrespondentTable(date, currentState = false) {
    if(currentState) {
        const limitOfBanks = await new LimitOfBanks().getRows()
        const currencyRate = await new CurrencyRate(new Date(), currentState).getRows()
        const [total, totalCash] = await (new TotalCashCurrent().getRows())
        const interbankDeposits = await (new CorrespondentInterbankDepositsCurrent().getRows(total))
        return {
            currencyRate,
            totalCash,
            interbankDeposits,
            limitOfBanks
        }
    }
    const [total, totalCash] = await (new TotalCash(date).getRows())
    const [
        currencyRate,
        interbankDeposits
    ] = await Promise.all([
        new CurrencyRate(date).getRows(),
        new CorrespondentInterbankDeposits(date).getRows(total)
    ])
    return {
        currencyRate,
        totalCash,
        interbankDeposits
    }
}

module.exports = getCorrespondentTable