import { OracleService } from '../../../oracle/oracle.service'
import { TopDepositsBase } from './top-deposits.base'

const getTopDepositsData = async (date: Date, oracleService: OracleService) => {
  const [accountsWithData] = await new TopDepositsBase(date, oracleService).getRows()
  return accountsWithData
}

export default getTopDepositsData
