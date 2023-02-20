import { OracleService } from '../../../oracle/oracle.service'
import { VlaBufferBase } from './vla-buffer.base'

export const getVlaBufferData = async (date: Date, oracleService: OracleService) => {
  const [incomes, incomeBringing, nonProfits, nonProfitable, highLiquidityAssets] =
    await new VlaBufferBase(date, oracleService).getRows()
  return { incomes, incomeBringing, nonProfits, nonProfitable, highLiquidityAssets }
}
