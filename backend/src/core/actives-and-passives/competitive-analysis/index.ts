import { OracleService } from '../../../oracle/oracle.service'
import { CompetitiveAnalysis } from './ca.base'

const getCompetitiveAnalysisData = async (date: Date, oracleService: OracleService) => {
  const [quarterDates, totalData] = await new CompetitiveAnalysis(date, oracleService).getRows()
  return { quarterDates, totalData }
}

export default getCompetitiveAnalysisData
