export interface DBData {
  yearBegin: number
  monthBegin: number
  selectedDate: number
  differ: number
  differPercent: string
}

export interface MainIndicatorRow {
  count: string
  indicatorName: string
  yearBegin: number
  monthBegin: number
  selectedDate: number
  differ: number
  differPercent: string
  isTableHead: boolean
}
