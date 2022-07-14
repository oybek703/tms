const TopDepositsMainClass = require("./TopDepositsMainClass")

async function getTopDepositsTable(date) {
    return await new TopDepositsMainClass(date).getRows()
}

module.exports = getTopDepositsTable