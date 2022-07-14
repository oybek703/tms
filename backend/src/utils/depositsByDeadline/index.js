const DepositsByDeadlineMainClass = require('./DepositsByDeadlineMainClass')

async function getDepositsByDeadlineTable(date) {
    return await new DepositsByDeadlineMainClass(date).getRows()
}

module.exports = getDepositsByDeadlineTable