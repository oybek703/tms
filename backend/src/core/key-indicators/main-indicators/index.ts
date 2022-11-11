import { OracleService } from '../../../oracle/oracle.service'
import { Actives } from './actives'

const getMainIndicatorsData = async (date: Date, oracleService: OracleService) => {
  return await new Actives(date, oracleService).getRows()
}
export default getMainIndicatorsData
