import { OracleService } from '../../../oracle/oracle.service'
import { GmBase } from './gm.base'

const getGmData = async (date: Date, oracleService: OracleService) => {
  const [updatedTableData, accredetiv, currRates] = await new GmBase(date, oracleService).getRows()
  return {
    tableData: updatedTableData,
    accredetiv,
    currRates
  }
}

export default getGmData
