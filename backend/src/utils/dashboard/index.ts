import DashboardCorrespondent from './dashboardCorrespondent'
import CreditPart from './creditPart'
import DashboardCurrencyPosition from './dashboardCurrencyPosition'
import Deposits from './Deposits'
import DashboardLiquidity from './dashboardLiquidity'
import CurrencyRates from './currencyRates'
import BankLimits from './bankLimits'

async function getDashboardData(date: string) {
  const [
    dashboardCorrespondent,
    { creditPart1, disaggregatedByTime, issuedCredits },
    dashboardCurrencyPosition,
    { timeDeposits, currencyMfi,
      currencyTimeDeposits, interbankDeposits,
      fundingStructure, currencyMBD },
    { vla, lcr, nsfr },
    currencyRates,
    bankLimits
  ] = await Promise.all([
    new DashboardCorrespondent(date).getRows(),
    new CreditPart(date).getRows(),
    new DashboardCurrencyPosition(date).getRows(),
    new Deposits(date).getRows(),
    new DashboardLiquidity(date).getRows(),
    new CurrencyRates(date).getRows(),
    new BankLimits().getRows()
  ])
  return {
    dashboardCorrespondent,
    creditPart: creditPart1,
    disaggregatedByTime,
    dashboardCurrencyPosition,
    timeDeposits,
    currencyMfi,
    currencyTimeDeposits,
    issuedCredits,
    interbankDeposits,
    fundingStructure,
    currencyMBD,
    vla,
    lcr,
    nsfr,
    currencyRates,
    bankLimits
  }
}

export default getDashboardData
