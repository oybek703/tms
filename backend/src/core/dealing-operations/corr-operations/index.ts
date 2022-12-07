import { OracleService } from '../../../oracle/oracle.service'
import { CorrOperationsBase } from './corr-operations.base'

export const getCorrOperationsData = async (
  firstDate: Date,
  secondDate: Date,
  oracleService: OracleService
) => {
  return await new CorrOperationsBase(firstDate, secondDate, oracleService).getRows()
}
