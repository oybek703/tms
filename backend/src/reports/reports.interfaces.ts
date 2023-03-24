export enum ReportsPaths {
  dashboardLastUpdate = 'dashboard/lastUpdate',
  dashboard = 'dashboard',
  creditData = 'creditData',
  dashboardMonthly = 'dashboardMonthly',
  mainIndicators = 'mainIndicators',
  capital = 'capital',
  profitAndLost = 'profitAndLost',
  liquidity = 'liquidity',
  liquidityCurrentState = 'liquidity/currentState',
  correspondent = 'correspondent',
  correspondentCurrentState = 'correspondent/currentState',
  calcFor = 'calcFor',
  calcForUpdateCbn = '/calcFor/updateCbn',
  currencyPosition = 'currencyPosition',
  vlaBuffer = 'vlaBuffer',
  vlaAndFor = 'vlaAndFor',
  placedAttracted = 'placedAttracted',
  interbankDeposits = 'interbankDeposits',
  topDeposits = 'topDeposits',
  timeDepoClients = 'timeDepoClients',
  timeDeposits = 'timeDeposits',
  depositsByDeadline = 'depositsByDeadline',
  reportLiabilities = 'reportLiabilities',
  reportLiabilities216 = 'reportLiabilities216',
  competitiveAnalysis = 'competitiveAnalysis',
  filialEffectiveness = 'filialEffectiveness',
  corrAccountsAnalyze = 'corrAccountsAnalyze',
  incomeAnalysis = 'incomeAnalysis',
  caaManual = 'caaManual',
  corrOperations = 'corrOperations',
  filialCp = 'filialCp',
  gm = 'gm',
  gap = 'gap',
  gapManual = 'gapManual',
  gapLastUpdate = 'gap/lastUpdate'
}

export interface IReportTwoDates {
  firstDate: Date
  secondDate: Date
}

export enum CAAColLabelNames {
  imports = 'Импорт оплаты',
  exports = 'Экс. поступ.',
  tradingFin = 'Торг. фин',
  fx = 'FX',
  creditLine = 'Кредитная линия',
  vostro = 'Востро',
  otherOperations = 'Прочие(виды операций)',
  corrAccounts = 'Корр.счет',
  genAgreement = 'Ген. соглашения',
  isda = 'ISDA',
  serviceSpeed = 'Скорость обслуживание',
  serviceQuality = 'Качество обслуживание',
  serviceCost = 'Стоимость услуг(тарифы)'
}

export interface CAAChangeHistory {
  userName: string
  dateModify: string
  bankName: string
  colName: string
  description: string
}

export interface ICorrOperationsOptions extends IReportTwoDates {
  currencyCode: string
  clientCode?: string | undefined
}

export interface ICbnUpdateBody {
  fromDate: Date
  toDate: Date
  cbNorm: number
}
