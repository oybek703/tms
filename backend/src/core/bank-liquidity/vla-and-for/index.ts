import { OracleService } from '../../../oracle/oracle.service'
import { VlaAndForBase } from './vla-and-for.base'

export const getVlaAndForData = async (date: Date, oracleService: OracleService) => {
  return new VlaAndForBase(date, oracleService).getRows()
}
