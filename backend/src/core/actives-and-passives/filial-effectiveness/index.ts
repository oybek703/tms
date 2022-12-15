import { OracleService } from '../../../oracle/oracle.service'
import { FilialEffectivenessBase } from './FL.base'

const getFilialEffectivenessData = async (date: Date, oracleService: OracleService) => {
  const [allData, roaTotal, roeTotal] = await new FilialEffectivenessBase(
    date,
    oracleService
  ).getRows()

  return { allData, roaTotal, roeTotal }
}

export default getFilialEffectivenessData
