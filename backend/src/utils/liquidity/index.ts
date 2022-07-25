import Obligations from './Obligations'
import ObligationsCurrent from './ObligationsCurrent'
import LiquidityAssets from './LiquidityAssets'
import LiquidityAssetsCurrent from './LiquidityAssetsCurrent'

async function getLiquidityTable(date: string, currentState: boolean) {
  if (currentState) {
    const [
      liquidityAssets,
      obligations
    ] = await Promise.all([
      // new Date() is added for getting yesterday currency rate
      new LiquidityAssetsCurrent().getRows(),
      new ObligationsCurrent().getRows()
    ])
    return {
      liquidityAssets,
      obligations
    }
  }
  const [
    liquidityAssets,
    obligations
  ] = await Promise.all([
    new LiquidityAssets(date).getRows(),
    new Obligations(date).getRows()
  ])
  return {
    liquidityAssets,
    obligations
  }
}

export default getLiquidityTable
