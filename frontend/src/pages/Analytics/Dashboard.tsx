import React, { Fragment, memo, useEffect } from 'react'
import Loader from '../../components/UI/Layout/Loader'
import Alert from '../../components/UI/Layout/Alert'
import DashboardMonthly from '../../components/UI/Layout/DashboardMonthly'
import PlacedAndAttracted from '../Treasury/PlacedAndAttracted'
import CalcFor from '../Treasury/CalcFor'
import WithDetailsButton from '../../components/UI/Layout/Dashboard/WithDetailsButton'
import Fcrb from '../../components/UI/Layout/Dashboard/Fcrb'
import Covenants from '../../components/UI/Layout/Dashboard/Covenants'
import Normatives from '../../components/UI/Layout/Dashboard/Normatives'
import BankLimits from '../../components/UI/Layout/Dashboard/BankLimits'
import DailyIndicators from '../../components/UI/Layout/Dashboard/DailyIndicators'
import CurrencyRatesTab from '../../components/UI/Layout/Dashboard/DashboardCurrencyRates'
import CapitalTab from '../../components/UI/Layout/Dashboard/CapitalTab'
import FundingTab from '../../components/UI/Layout/Dashboard/FundingTab'
import CreditPortfolioTab from '../../components/UI/Layout/Dashboard/CreditPortfolioTab'
import useTypedSelector from '../../hooks/useTypedSelector'
import DashboardTabs from '../../components/UI/Layout/Tabs/DashboardTabs'
import useActions1 from '../../hooks/useActions1'

const Dashboard = () => {
	const { fetchDashboard } = useActions1()
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
		<Fragment>
			{loading ? (
				<Loader />
			) : error ? (
				<Alert message={error} />
			) : (
				<>
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
										dashboardCurrencyPosition={dashboardCurrencyPosition}
									/>
								)
							},
							{
								name: 'Курсы валют',
								panel: <CurrencyRatesTab currencyRates={currencyRates} />
							},
							{ name: 'ЦРБ', panel: <Fcrb /> },
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
								name: 'Капитал',
								panel: <CapitalTab vla={vla} />
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
							{ name: 'Dashboard', panel: <DashboardMonthly /> }
						]}
					/>
				</>
			)}
		</Fragment>
	)
}

export default memo(Dashboard)
