export interface IGmDbData {
  saldoOut: number
}

export interface IGMRow extends IGmDbData {
  checkAccount: string
  operationType: string
  parValue: number
  codeCurrency: string
}
