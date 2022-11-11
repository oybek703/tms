export interface ICorrespondentDbData {
  uzs: number
  cny: number
  jpy: number
  kzt: number
  rub: number
  chf: number
  gbp: number
  usd: number
  eur: number
}

export interface ICorrespondentRow extends ICorrespondentDbData {
  count: string
  indicatorName: string
  isTableHead?: boolean
  isNegative?: boolean
}

export enum CorrespondentCols {
  uzs = 'uzs',
  cny = 'cny',
  jpy = 'jpy',
  kzt = 'kzt',
  rub = 'rub',
  chf = 'chf',
  gbp = 'gbp',
  usd = 'usd',
  eur = 'eur'
}
