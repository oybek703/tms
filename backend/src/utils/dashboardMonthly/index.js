const DashboardMonthlyMainClass = require('./dashboardMonthlyMainClass')
const RiskPartClass = require('./riskPartClass')

async function getDashboardMonthlyData(firstDate, secondDate, dateOption) {
    const {capital, liquidity} = await new DashboardMonthlyMainClass(firstDate, secondDate, dateOption).getRows()
    const riskPart = await new RiskPartClass(firstDate, secondDate, dateOption).getRows()
    return {
        capital,
        liquidity,
        riskPart
    }
}

module.exports = getDashboardMonthlyData

