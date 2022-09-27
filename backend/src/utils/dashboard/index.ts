import DashboardCorrespondent from './dashboardCorrespondent'
import DashboardCurrencyPosition from './dashboardCurrencyPosition'
import Deposits from './Deposits'
import DashboardLiquidity from './dashboardLiquidity'
import CurrencyRates from './currencyRates'
import BankLimits from './bankLimits'

async function getDashboardData(date: string) {
	const [
		dashboardCorrespondent,
		dashboardCurrencyPosition,
		{
			timeDeposits,
			currencyMfi,
			currencyTimeDeposits,
			interbankDeposits,
			fundingStructure,
			currencyMBD
		},
		{ vla, lcr, nsfr },
		currencyRates,
		bankLimits
	] = await Promise.all([
		new DashboardCorrespondent(date).getRows(),
		new DashboardCurrencyPosition(date).getRows(),
		new Deposits(date).getRows(),
		new DashboardLiquidity(date).getRows(),
		new CurrencyRates(date).getRows(),
		new BankLimits().getRows()
	])
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
		currencyRates,
		bankLimits
	}
}

export default getDashboardData
