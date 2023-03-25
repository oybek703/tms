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
