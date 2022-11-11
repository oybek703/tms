export interface IProfitLostDbData {
  yearBegin: number
  monthBegin: number
  selectedDate: number
  differ: number
  differPercent: string
}

export interface IProfitLostRow extends IProfitLostDbData {
  count: string
  indicatorName: string
  isTableHead?: boolean
}
