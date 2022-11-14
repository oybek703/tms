import { OracleService } from '../../../oracle/oracle.service'
import { CapitalBase } from './capital.base'

const getCapitalData = async (date: Date, oracleService: OracleService) => {
  return await new CapitalBase(date, oracleService).getRows()
}

export default getCapitalData
