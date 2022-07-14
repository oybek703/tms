const TimeDepositsMainClass = require('./TimeDepositsMainClass')

async function getTimeDepositsTable(date) {
    return await new TimeDepositsMainClass(date).getRows(date)
}

module.exports = getTimeDepositsTable