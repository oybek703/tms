const InterbankDeposits = require("./InterbankDeposits")

async function getInterbankDepositsTable(date) {
    return await new InterbankDeposits(date).getRows(date)
}

module.exports = getInterbankDepositsTable