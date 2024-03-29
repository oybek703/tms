import React, { memo, useEffect } from 'react'
import DashboardMonthly from '../../components/layout/DashboardMonthly'
import PlacedAndAttracted from '../activesPassives/PlacedAttracted'
import CalcFor from '../bankLiquidity/CalcFor'
import WithDetailsButton from '../../components/layout/Dashboard/WithDetailsButton'
import Covenants from '../../components/layout/Dashboard/Covenants'
import Normatives from '../../components/layout/Dashboard/Normatives'
import BankLimits from '../../components/layout/Dashboard/BankLimits'
import DailyIndicators from '../../components/layout/Dashboard/DailyIndicators'
import CurrencyRatesTab from '../../components/layout/Dashboard/DashboardCurrencyRates'
import FundingTab from '../../components/layout/Dashboard/FundingTab'
import CreditPortfolioTab from '../../components/layout/Dashboard/CreditPortfolioTab'
import useTypedSelector from '../../hooks/useTypedSelector'
import DashboardTabs from '../../components/layout/Tabs/DashboardTabs'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const Dashboard = () => {
	const { fetchDashboard } = useActions()
	const { reportDate } = useTypedSelector(state => state.operDays)
	const { dashboard, loading, error } = useTypedSelector(state => state.dashboard)
	const {
		dashboardCorrespondent = {},
		dashboardCurrencyPosition = {},
		timeDeposits = [],
		currencyMfi = [],
		currencyTimeDeposits = [],
		interbankDeposits = [],
		currencyMBD = [],
		vla = {},
		lcr = {},
		nsfr = {},
		il = {},
		currencyRates,
		bankLimits = {}
	} = dashboard
	useEffect(() => {
		fetchDashboard()
	}, [fetchDashboard, reportDate])
	useEffect(() => {
		window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
	}, [])
	return (
		<LoaderWrapper loading={loading} error={error}>
			<DashboardTabs
				tabs={[
					{
						name: 'Eжедневные показатели',
						panel: (
							<DailyIndicators
								dashboardCorrespondent={dashboardCorrespondent}
								lcr={lcr}
								nsfr={nsfr}
								vla={vla}
								il={il}
								dashboardCurrencyPosition={dashboardCurrencyPosition}
							/>
						)
					},
					{
						name: 'Курсы валют',
						panel: <CurrencyRatesTab currencyRates={currencyRates} />
					},
					{
						name: 'Лимиты',
						panel: <BankLimits bankLimits={bankLimits as any} />
					},
					{
						name: 'ФОР',
						panel: (
							<WithDetailsButton link={'/calcfor'}>
								<CalcFor forDashboard />
							</WithDetailsButton>
						)
					},
					{
						name: 'Активы и пассивы',
						panel: (
							<WithDetailsButton link="/plat">
								<PlacedAndAttracted forDashboard />
							</WithDetailsButton>
						)
					},
					{
						name: 'Фондирование',
						panel: (
							<FundingTab
								currencyMBD={currencyMBD}
								currencyMfi={currencyMfi}
								currencyTimeDeposits={currencyTimeDeposits}
								interbankDeposits={interbankDeposits}
								timeDeposits={timeDeposits}
							/>
						)
					},
					{
						name: 'Нормативы',
						panel: <Normatives />
					},
					{
						name: 'Ковенанты',
						panel: <Covenants />
					},
					{
						name: 'Кредитный портфель',
						panel: <CreditPortfolioTab />
					},
					{ name: 'dashboard', panel: <DashboardMonthly /> }
				]}
			/>
		</LoaderWrapper>
	)
}

export default memo(Dashboard)
