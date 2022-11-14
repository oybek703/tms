import { OracleService } from '../../../oracle/oracle.service'
import { DepositsByDeadlineBase } from './DBD.base'

const getDepositsByDeadlineData = async (date: Date, oracleService: OracleService) => {
  return new DepositsByDeadlineBase(date, oracleService).getRows()
}

export default getDepositsByDeadlineData
