const ProfitLostMainClass = require('./profitLostMainClass')

async function getProfitAndLostTable(date) {
    return await new ProfitLostMainClass(date).getRows()
}

module.exports = getProfitAndLostTable