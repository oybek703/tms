import { OracleService } from '../../../oracle/oracle.service'
import { FilialEffectivenessBase } from './FL.base'

const getFilialEffectivenessData = async (date: Date, oracleService: OracleService) => {
  return await new FilialEffectivenessBase(date, oracleService).getRows()
}

export default getFilialEffectivenessData
