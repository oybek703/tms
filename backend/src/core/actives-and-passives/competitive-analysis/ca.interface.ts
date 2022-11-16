export type Balances = 'npl' | 'pfl' | 'res'
export type RiskBalances = `${Uppercase<Balances>}_BALANCE`

export interface IQuarterDates {
  quarterDates: string
  date: string
}

export interface ICADbData {
  value: number
}

export interface ICARow {
  indicatorName: string
  firstDate: number
  secondDate: number
  thirdDate: number
  fourthDate: number
}
