import { OracleService } from '../../oracle/oracle.service'
import { DashboardCorrespondent } from './d-correspondent'
import { DashboardCurrencyPosition } from './d-currency-position'
import { Deposits } from './deposits'
import { DashboardLiquidity } from './d-liquidity'
import { IConfigOptions } from './dashboard.interface'
import { CurrencyRates } from './currency-rates'
import { HttpService } from '@nestjs/axios'
import { BankLimits } from './bank-limits'
import { Fcrb } from './fcrb'
import { CreditData } from './credit-data'
import { DashboardMonthly } from './dashboard-monthly'
import { RiskPart } from './dashboard-monthly'

const getDashboardData = async (
  date: Date,
  oracleService: OracleService,
  configOptions: IConfigOptions,
  httpService: HttpService
) => {
  const [
    dashboardCorrespondent,
    [currencyPosition, position],
    [
      timeDeposits,
      currencyMfi,
      currencyTimeDeposits,
      interbankDeposits,
      fundingStructure,
      currencyMBD
    ],
    [vla, lcr, nsfr, il],
    [cbRate, legalEntitiesRates, individualsRates, last90Rates],
    [foreignBanks, localBanks]
  ] = await Promise.all([
    new DashboardCorrespondent(date, oracleService).getRows(),
    new DashboardCurrencyPosition(date, oracleService).getRows(),
    new Deposits(date, oracleService).getRows(),
    new DashboardLiquidity(date, oracleService).getRows(),
    new CurrencyRates(date, oracleService, configOptions, httpService).getRows(),
    new BankLimits(oracleService).getRows()
  ])
  const bankLimits = { foreignBanks, localBanks }
  const dashboardCurrencyPosition = { currencyPosition, position }
  const currencyRates = { cbRate, legalEntitiesRates, individualsRates, last90Rates }
  return {
    dashboardCorrespondent,
    dashboardCurrencyPosition,
    timeDeposits,
    currencyMfi,
    currencyTimeDeposits,
    interbankDeposits,
    fundingStructure,
    currencyMBD,
    vla,
    lcr,
    nsfr,
    il,
    currencyRates,
    bankLimits
  }
}

export const getFcrbData = async (date: Date, oracleService: OracleService) => {
  const [mfiData, treasuryData, retailData, centralizedResourceBaseData, portfolioData] =
    await new Fcrb(date, oracleService).getRows()
  return { mfiData, treasuryData, retailData, centralizedResourceBaseData, portfolioData }
}

export const getCreditData = async (date: Date, oracleService: OracleService) => {
  const [creditPart, disaggregatedByTime, issuedCredits] = await new CreditData(
    date,
    oracleService
  ).getRows()
  return { creditPart, disaggregatedByTime, issuedCredits }
}

export const getDashboardMonthlyData = async (
  firstDate: Date,
  secondDate: Date,
  oracleService: OracleService
) => {
  const [capital, liquidity] = await new DashboardMonthly(
    firstDate,
    secondDate,
    oracleService
  ).getRows()
  const riskPart = await new RiskPart(firstDate, secondDate, oracleService).getRows()
  return {
    capital,
    liquidity,
    riskPart
  }
}

export default getDashboardData
