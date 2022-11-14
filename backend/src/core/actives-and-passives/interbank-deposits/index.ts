import { OracleService } from '../../../oracle/oracle.service'
import { InterbankDeposits } from './interbank-deposits'

export const getInterbankDepositsData = async (date: Date, oracleService: OracleService) => {
  const land = await new InterbankDeposits(date, oracleService).getRows('land')
  const borrow = await new InterbankDeposits(date, oracleService).getRows('borrow')
  const fullBorrowData = await new InterbankDeposits(date, oracleService).getRows('fullBorrow')
  const fullLandData = await new InterbankDeposits(date, oracleService).getRows('fullLand')
  return { land, borrow, fullBorrowData, fullLandData }
}
