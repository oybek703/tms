export interface ILiquidityDbData {
  total: number
  natCurr: number
  forCurr: number
  usaDollar: number
  evro: number
}

export interface ILiquidityRow extends ILiquidityDbData {
  count: string
  indicatorName: string
  isTableHead: boolean
}

export interface IFlowsRow {
  indicatorName: string
  uzs: string
  usd: string
  eur: string
  rub: string
}
