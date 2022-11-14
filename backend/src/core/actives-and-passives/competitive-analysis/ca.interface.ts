export type Balances = 'npl' | 'pfl' | 'res'
export type RiskBalances = `${Uppercase<Balances>}_BALANCE`

export interface IQuarterDates {
  quarterDates: string
  date: string
}

export interface IQuarterCols {
  q1: number
  q2: number
  q3: number
  q4: number
}
