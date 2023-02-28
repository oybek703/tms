import { OracleService } from '../../../oracle/oracle.service'
import { ReportLiabilitiesBase } from './RL.base'
import { ReportLiabilities216 } from './RL216.base'

const getReportLiabilitiesData = async (date: Date, oracleService: OracleService) => {
  return await new ReportLiabilitiesBase(date, oracleService).getRows()
}

export const getReportLiabilities216Data = async (date: Date, oracleService: OracleService) => {
  return await new ReportLiabilities216(date, oracleService).getRows()
}

export default getReportLiabilitiesData
