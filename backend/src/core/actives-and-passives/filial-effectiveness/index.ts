import { OracleService } from '../../../oracle/oracle.service'
import { FilialEffectivenessBase } from './FL.base'

const getFilialEffectivenessData = async (date: Date, oracleService: OracleService) => {
  const totalData = await new FilialEffectivenessBase(date, oracleService).getRows()
  const roe = await new FilialEffectivenessBase(date, oracleService).getRoe()
  const roa = await new FilialEffectivenessBase(date, oracleService).getRoa()

  return { totalData: [totalData], roe, roa }
}

export default getFilialEffectivenessData
