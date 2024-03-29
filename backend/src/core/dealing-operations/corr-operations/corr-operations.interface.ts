export interface IBankList {
  clientCode: string
  bankName: string
}

export interface ICorrOperationsDbData {
  bankNameOrYear: string
  debit: number
  credit: number
}

export interface IBankDbData {
  country: string
  clientCode: string
  swiftCode: string
  dateOpen: string
  volumeOperations: string
  serviceSpeed: string
  serviceQuality: string
  serviceCost: string
  corrAccounts: string
  genAgreement: string
  isda: string
  otherAgrement: string
  imports: string
  exports: string
  tradingFin: string
  interbankDeposits: string
  creditLine: string
  conversionAccounts: string
  vostro: string
  otherOperations: string
}

export interface IRemainderDbData {
  currencyName: string
  saldoOut: number
}

export enum CorrOperationsQueries {
  volume = `1=1`,
  fx = `SUBSTR(ACCOUNT_CO, 1, 5)='17101'`,
  physicalPayments = `(SUBSTR(ACCOUNT_CO, 1, 5) IN ('20206', '20406', '20606'))`,
  legalPayments = `((SUBSTR(ACCOUNT_CO, 1, 3) IN ('202', '204', '206')
  AND SUBSTR(ACCOUNT_CO, 1, 5) NOT IN ('20206', '20406', '20606'))
  OR SUBSTR(ACCOUNT_CO, 1, 5) IN ('22614', '22602'))`,
  interbankOperations = `SUBSTR(ACCOUNT_CO, 1, 5) IN ('10521', '10531', '10541')`,
  loroAccountsOperations = `SUBSTR(ACCOUNT_CO, 1, 5) IN ('21002')`,
  accredetivOperations = `SUBSTR(ACCOUNT_CO, 1, 5) IN ('22602')`
}
