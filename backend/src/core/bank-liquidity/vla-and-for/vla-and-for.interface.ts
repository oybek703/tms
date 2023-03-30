export interface IVlaAndForDbData {
  total: number
  natCurr: number
  forCurr: number
  usaDollar: number
  evro: number
}

export interface IVlaAndForRow extends IVlaAndForDbData {
  count: string
  indicatorName: string
  isTableHead: boolean
}

export interface IFlowsRow {
  indicatorName: string
  indicatorType: number
  indicatorId: number
  uzs: string
  usd: string
  eur: string
  rub: string
}
