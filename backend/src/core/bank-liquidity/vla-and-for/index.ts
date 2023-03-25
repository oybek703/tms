import { OracleService } from '../../../oracle/oracle.service'
import { VlaAndForBase } from './vla-and-for.base'
import { LiquidityAssets } from '../liquidity/liquidity-assets'

export const getVlaAndForData = async (date: Date, oracleService: OracleService) => {
  const liquidityAssets = await new LiquidityAssets(date, oracleService).getRows()
  const vlaCurrentData = new VlaAndForBase(date, oracleService).getRows()
  return { liquidityAssets, vlaCurrentData }
}
