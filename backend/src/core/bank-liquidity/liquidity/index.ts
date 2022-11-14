import { LiquidityAssets } from './liquidity-assets'
import { OracleService } from '../../../oracle/oracle.service'
import { Obligations } from './obligations'
import { LiquidityAssetsCurrent } from './liquidity-assets-current'
import { ObligationsCurrent } from './obligations-current'

const getLiquidityData = async (date: Date, oracleService: OracleService) => {
  const [liquidityAssets, obligations] = await Promise.all([
    new LiquidityAssets(date, oracleService).getRows(),
    new Obligations(date, oracleService).getRows()
  ])
  return {
    liquidityAssets,
    obligations
  }
}

export const getLiquidityCurrentData = async (oracleService: OracleService) => {
  const [liquidityAssets, obligations] = await Promise.all([
    new LiquidityAssetsCurrent(oracleService).getRows(),
    new ObligationsCurrent(oracleService).getRows()
  ])
  return {
    liquidityAssets,
    obligations
  }
}

export default getLiquidityData
