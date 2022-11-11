import { OracleService } from '../../oracle/oracle.service'
import { GapBase } from './gap.base'
import { GapManual } from './gap-manual'

const getGapData = async (oracleService: OracleService) => {
  const [
    months,
    sourceOfLiquidity,
    sourceOfLiquidityTotal,
    needsOfLiquidity,
    needsOfLiquidityTotal,
    vlaLcrData,
    lcrData,
    nsfrData
  ] = await new GapBase(oracleService).getRows()
  return {
    months,
    sourceOfLiquidity,
    sourceOfLiquidityTotal,
    needsOfLiquidity,
    needsOfLiquidityTotal,
    vlaLcrData,
    lcrData,
    nsfrData
  }
}

export const getGapManualData = async (forEditing: boolean, oracleService: OracleService) => {
  const [
    months,
    sourceOfLiquidity,
    sourceOfLiquidityTotal,
    needsOfLiquidity,
    needsOfLiquidityTotal,
    vlaLcrData
  ] = await new GapManual(oracleService, forEditing).getRows()
  return {
    months,
    sourceOfLiquidity,
    sourceOfLiquidityTotal,
    needsOfLiquidity,
    needsOfLiquidityTotal,
    vlaLcrData
  }
}

export default getGapData
