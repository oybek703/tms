export enum ReportsPaths {
  dashboardLastUpdate = 'dashboard/lastUpdate',
  dashboard = 'dashboard',
  fcrb = 'fcrb',
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
  currencyPosition = 'currencyPosition',
  nostroMatrix = 'nostroMatrix',
  vlaBuffer = 'vlaBuffer',
  placedAttracted = 'placedAttracted',
  interbankDeposits = 'interbankDeposits',
  topDeposits = 'topDeposits',
  timeDepoClients = 'timeDepoClients',
  timeDeposits = 'timeDeposits',
  depositsByDeadline = 'depositsByDeadline',
  reportLiabilities = 'reportLiabilities',
  competitiveAnalysis = 'competitiveAnalysis',
  filialEffectiveness = 'filialEffectiveness',
  corrAccountsAnalyze = 'corrAccountsAnalyze',
  caaManual = 'caaManual',
  gm = 'gm',
  gap = 'gap',
  gapManual = 'gapManual',
  gapLastUpdate = 'gap/lastUpdate'
}

export enum CAAColLabelNames {
  imports = 'Импорт оплаты',
  exports = 'Экс. поступ.',
  tradingFin = 'Торг. фин',
  mbd = 'МБД',
  fx = 'FX',
  creditLine = 'Кредитная линия',
  vostro = 'Востро',
  otherOperations = 'Прочие(виды операций)',
  corrAccounts = 'Корр.счет',
  genAgreement = 'Ген. соглашения',
  isda = 'ISDA',
  otherAgreement = 'Прочие(нал. соглашения)',
  serviceSize = 'Обьем операции',
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
