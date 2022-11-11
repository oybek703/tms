import { OracleService } from '../../../oracle/oracle.service'
import { CurrencyPositionBase } from './CP.base'

export const getCurrencyPositionData = async (date: Date, oracleService: OracleService) => {
  const [allRows, tableSumData] = await new CurrencyPositionBase(date, oracleService).getRows()
  return { allRows, tableSumData }
}

export default getCurrencyPositionData
