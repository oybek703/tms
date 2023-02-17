export interface IDate {
  dat: string
}

export interface IIncomeDbData {
  monthName: string
  saldo: number
}

export enum IIncomeQueryCodes {
  // АНАЛИЗ ПРОЦЕНТНОГО ДОХОДА
  otherPercentIncomes = `SUBSTR(COA_CODE, 1, 3) IN ('449', '447', '450', '451')`,
  forLongTermIncomes = `SUBSTR(COA_CODE, 1, 3) IN ('439', '441', '443', '444', '445', '446')`,
  interestIncome = `SUBSTR(COA_CODE, 1, 3) IN ('406')`,
  unpaidAcceptances = `SUBSTR(COA_CODE, 1, 3) IN ('410')`,
  byInvestments = `SUBSTR(COA_CODE, 1, 3) IN ('448')`,
  otherBanksAccounts = `SUBSTR(COA_CODE, 1, 3) IN ('404')`,
  // АНАЛИЗ БЕСПРОЦЕНТНОГО ДОХОДА
  creditReserve = `COA_CODE = '45921'`,
  spotSell = `COA_CODE = '45401'`,
  spotRemark = `COA_CODE = '45403'`,
  debitTurnOvers = `COA_CODE = '45249'`,
  accredetivServices = `COA_CODE = '45225'`,
  moneyTransfers = `COA_CODE = '45253'`,
  // АНАЛИЗ ПРОЦЕНТНОГО РАСХОДА
  otherPercentConsumptions = `COA_CODE = '54904'`,
  longTermLoans = `SUBSTR(COA_CODE, 1, 3) IN ('541')`,
  termDeposits = `SUBSTR(COA_CODE, 1, 3) IN ('511')`,
  shortTermLoans = `SUBSTR(COA_CODE, 1, 3) IN ('531')`,
  issuedSecurities = `COA_CODE = '54206'`,
  savingDeposits = `SUBSTR(COA_CODE, 1, 3) IN ('506')`,
  // АНАЛИЗ БЕСПРОЦЕНТНОГО РАСХОДА
  employeeExpenses = `SUBSTR(COA_CODE, 1, 3) IN ('561')`,
  possibleLosses = `SUBSTR(COA_CODE, 1, 3) IN ('568')`,
  administrativeExpenses = `SUBSTR(COA_CODE, 1, 3) IN ('564')`,
  travelExpenses = `SUBSTR(COA_CODE, 1, 3) IN ('563')`,
  wearCosts = `SUBSTR(COA_CODE, 1, 3) IN ('566')`,
  rentAndMaintenance = `SUBSTR(COA_CODE, 1, 3) IN ('562')`
}
