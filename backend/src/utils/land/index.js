const InterBankDepositsMainClass = require("../interbankDeposits/InterBankDepositsMainClass")

async function getLandTable(date) {
    return await new InterBankDepositsMainClass(date, 'land').getRows()
}

module.exports = getLandTable