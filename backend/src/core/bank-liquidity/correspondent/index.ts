import { OracleService } from '../../../oracle/oracle.service'
import { TotalCash } from './total-cash'
import { CurrencyRate } from './currency-rate'
import { InterbankDeposits } from './interbank-deposits'
import { InterbankDepositsCurrent } from './interbank-deposits-current'
import { TotalCashCurrent } from './total-cash-current'
import { CurrencyRateCurrent } from './currency-rate-current'

const getCorrespondentData = async (date: Date, oracleService: OracleService) => {
  const [total, totalCash] = await new TotalCash(date, oracleService).getRows()
  const [currencyRate, interbankDeposits] = await Promise.all([
    new CurrencyRate(date, oracleService).getRows(),
    new InterbankDeposits(date, oracleService).getRows(total)
  ])
  return { currencyRate, totalCash, interbankDeposits }
}

export const getCorrespondentCurrentData = async (oracleService: OracleService) => {
  const currencyRate = await new CurrencyRateCurrent(oracleService).getRows()
  const [total, totalCash] = await new TotalCashCurrent(oracleService).getRows()
  const interbankDeposits = await new InterbankDepositsCurrent(oracleService).getRows(total)
  return {
    currencyRate,
    totalCash,
    interbankDeposits
  }
}

export default getCorrespondentData
