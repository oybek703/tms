import { OracleService } from '../../../oracle/oracle.service'
import { TimeDepoClientsBase } from './TDC.base'

const getTimeDepoClientsData = async (date: Date, oracleService: OracleService) => {
  return new TimeDepoClientsBase(date, oracleService).getRows()
}

export default getTimeDepoClientsData
