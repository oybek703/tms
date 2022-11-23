import { OracleService } from '../../oracle/oracle.service'
import { CaaBase } from './caa.base'

const getCorrAccountsAnalyzeData = async (oracleService: OracleService) => {
  return await new CaaBase(oracleService).getRows()
}

export default getCorrAccountsAnalyzeData
