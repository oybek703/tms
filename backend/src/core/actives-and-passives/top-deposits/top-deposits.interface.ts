export interface ITopDepositsDbData {
  name: string
  saldoOut: number
  percent: number
}

export interface ITopDepositsData {
  [key: string]: ITopDepositsDbData
}
