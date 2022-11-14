import { OracleService } from '../../../oracle/oracle.service'
import { ReportLiabilitiesBase } from './RL.base'

const getReportLiabilitiesData = async (date: Date, oracleService: OracleService) => {
  return await new ReportLiabilitiesBase(date, oracleService).getRows()
}

export default getReportLiabilitiesData
