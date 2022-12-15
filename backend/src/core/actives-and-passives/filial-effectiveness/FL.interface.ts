export interface IFilialEffectivenessData {
  mfo: string
  filialName: string
  deposit202: number
  deposit204: number
  deposit206: number
  totalLoan: number
  issuedLoans: number
  par30: number
  par60: number
  par90: number
  npl: number
  nplPercent: number
  accruedInterest: number
  roa: number
  roe: number
  resourceDebt: number
  benefitInMonth: number
}

export interface IRoaRoeTotal {
  total: number
}
