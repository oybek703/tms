export type Balances = 'npl' | 'pfl' | 'res'
export type RiskBalances = `${Uppercase<Balances>}_BALANCE`
export type ActivesCols = 'TOTAL' | 'NAT_CURR' | 'FOR_CURR'
export type QuarterDatesArray = [string, string, string, string]

export interface IQuarterDates {
  quarterDates: string
  date: string
  monthFirstDate: string
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
  tabbed?: boolean
  redBold?: boolean
}

export interface ICARowOptions {
  tabbed?: boolean
  redBold?: boolean
}

export enum CASaldoQueries {
  corporateCredits = `SUBSTR(BAL, 1, 3) BETWEEN '126' AND '156' AND SUBSTR(BAL, 1, 3) != '149' AND SUBSTR(BAL, 4, 2) != '99'`,
  retailCredits = `SUBSTR(BAL, 1, 3) IN ('126', '149') AND SUBSTR(BAL, 4, 2) != '99'`,
  totalClientDeposits = `SUBSTR(BAL, 1, 3) IN ('202', '204', '206')`,
  corporateClientDeposits = `SUBSTR(BAL, 1, 3) IN ('202', '204', '206') and BAL NOT IN ('20206', '20406', '20606')`,
  retailClientDeposits = `BAL IN ('20206', '20406', '20606')`,
  creditLines = `SUBSTR(BAL, 1, 3) IN ('216', '220')`,
  liabilities = `(BAL LIKE '2%' AND BAL NOT LIKE '222%') OR BAL LIKE '175%'`,
  liabilitiesNational = `(BAL LIKE '2%' AND BAL NOT LIKE '222%') OR BAL LIKE '175%' AND VAL = '000'`,
  liabilitiesForeign = `(BAL LIKE '2%' AND BAL NOT LIKE '222%') OR BAL LIKE '175%' AND VAL != '000'`,
  capital = `SUBSTR(BAL, 1, 1) IN ('3', '4', '5')`,
  cleanProfit = `SUBSTR(BAL, 1, 1) IN ('4','5') OR BAL = '31206'`
}

export type LiquidityRoles = 'VLA' | 'LCR' | 'NSFR'

export enum RoaRoeQueries {
  ROA = `BAL LIKE '1%' AND SUBSTR(BAL, 1, 3) NOT IN ('161', '175')`,
  ROE = `BAL LIKE '3%'`
}
