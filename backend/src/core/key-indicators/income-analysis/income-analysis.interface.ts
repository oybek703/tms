export interface IDate {
  dat: string
}

export interface IIncomeDbData {
  monthName: string
  saldo: number
}

export enum IIncomeQueryCodes {
  otherPercentIncomes = `SUBSTR(COA_CODE, 1, 3) IN ('449', '447', '450', '451')`,
  forLongTermIncomes = `SUBSTR(COA_CODE, 1, 3) IN ('439', '441', '443', '444', '445', '446')`,
  interestIncome = `SUBSTR(COA_CODE, 1, 3) IN ('406')`,
  unpaidAcceptances = `SUBSTR(COA_CODE, 1, 3) IN ('410')`,
  byInvestments = `SUBSTR(COA_CODE, 1, 3) IN ('448')`,
  otherBanksAccounts = `SUBSTR(COA_CODE, 1, 3) IN ('404')`
}
