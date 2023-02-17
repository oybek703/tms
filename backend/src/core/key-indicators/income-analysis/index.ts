import { OracleService } from '../../../oracle/oracle.service'
import { IncomeAnalysisBase } from './income-analysis.base'

const getIncomeAnalysisData = async (date: Date, oracleService: OracleService) => {
  return await new IncomeAnalysisBase(date, oracleService).getRows()
}

export default getIncomeAnalysisData
