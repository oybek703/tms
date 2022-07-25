import DashboardMonthlyMainClass from './dashboardMonthlyMainClass'
import RiskPartClass from './riskPartClass'

async function getDashboardMonthlyData(firstDate: string, secondDate: string, dateOption: string) {
  const { capital, liquidity } = await new DashboardMonthlyMainClass(firstDate, secondDate, dateOption).getRows()
  const riskPart = await new RiskPartClass(firstDate, secondDate, dateOption).getRows()
  return {
    capital,
    liquidity,
    riskPart
  }
}

export default getDashboardMonthlyData

