import { ProfitAndLostBase } from './profit-lost.base'
import { OracleService } from '../../../oracle/oracle.service'

const getProfitAndLostData = async (date: Date, oracleService: OracleService) => {
  return await new ProfitAndLostBase(date, oracleService).getRows()
}

export default getProfitAndLostData
