import { OracleService } from '../../../oracle/oracle.service'
import { VlaBufferBase } from './vla-buffer.base'

export const getVlaBufferData = async (date: Date, oracleService: OracleService) => {
  const [liquidityAssets, liabilitiesOnDemand] = await new VlaBufferBase(
    date,
    oracleService
  ).getRows()
  return { liquidityAssets, liabilitiesOnDemand }
}
