import { OracleService } from '../../../oracle/oracle.service'
import { CalcForBase } from './calc-for.base'

export const getCalcFor = async (date: Date, oracleService: OracleService) => {
  return await new CalcForBase(date, oracleService).getRows()
}
export default getCalcFor
