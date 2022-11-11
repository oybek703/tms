import { OracleService } from '../../../oracle/oracle.service'
import { PlacedAttractedBase } from './placed-attracted.base'

export const getPlacedAttractedData = async (date: Date, oracleService: OracleService) => {
  const [involvedFunds, placedFunds] = await new PlacedAttractedBase(date, oracleService).getRows()
  return { involvedFunds, placedFunds }
}

export default getPlacedAttractedData
