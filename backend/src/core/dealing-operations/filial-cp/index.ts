import { OracleService } from '../../../oracle/oracle.service'
import { FilialCpBase } from './filial-cp.base'

export const getFilialCpData = async (
  firstDate: Date,
  secondDate: Date,
  currencyCode: string,
  oracleService: OracleService
) => {
  return await new FilialCpBase(firstDate, secondDate, currencyCode, oracleService).getRows()
}
