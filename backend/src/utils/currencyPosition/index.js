const CurrencyPositionMainClass = require("./CurrencyPositionMainClass")

async function getCurrencyPositionTable(date) {
    return await new CurrencyPositionMainClass(date).getRows()
}

module.exports = getCurrencyPositionTable