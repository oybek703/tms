import { OracleService } from '../../../oracle/oracle.service'
import { NostroMatrixBase } from './nostro-matrix.base'

export const getNostroMatrixData = async (
  firstDate: Date,
  secondDate: Date,
  oracleService: OracleService
) => {
  return await new NostroMatrixBase(firstDate, secondDate, oracleService).getRows()
}
