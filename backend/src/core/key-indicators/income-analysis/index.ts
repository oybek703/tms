import { OracleService } from '../../../oracle/oracle.service'
import { IncomeAnalysisBase } from './income-analysis.base'

const getIncomeAnalysisData = async (date: Date, oracleService: OracleService) => {
  const [income] = await new IncomeAnalysisBase(date, oracleService).getRows()
  return { income }
}

export default getIncomeAnalysisData
