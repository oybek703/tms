const InterBankDepositsMainClass = require("../interbankDeposits/InterBankDepositsMainClass")

async function getBorrowTable(date) {
    return await new InterBankDepositsMainClass(date, 'borrow').getRows()
}

module.exports = getBorrowTable