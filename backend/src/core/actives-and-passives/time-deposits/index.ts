import { OracleService } from '../../../oracle/oracle.service'
import { TimeDepositsBase } from './time-deposits.base'

const getTimeDepositsData = async (date: Date, oracleService: OracleService) => {
  const [currentBalance, balanceInMonthBegin, tableData] = await new TimeDepositsBase(
    date,
    oracleService
  ).getRows()
  return { currentBalance, balanceInMonthBegin, tableData }
}

export default getTimeDepositsData
