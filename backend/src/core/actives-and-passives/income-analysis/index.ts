import { OracleService } from '../../../oracle/oracle.service'
import { IncomeAnalysisBase } from './income-analysis.base'

const getIncomeAnalysisData = async (date: Date, oracleService: OracleService) => {
  const [income, incomeNoPercent, consumption, consumptionNoPercent] = await new IncomeAnalysisBase(
    date,
    oracleService
  ).getRows()
  return { income, incomeNoPercent, consumption, consumptionNoPercent }
}

export default getIncomeAnalysisData
