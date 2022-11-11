import { ThemeProvider } from '@mui/material/styles'
import theme from './components/UI/theme'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Header from './components/UI/Layout/Navigation/Header'
import './App.css'
import ErrorBoundary from './components/error-boundary/error-boundary'
import Footer from './components/UI/Layout/Navigation/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useTypedSelector from './hooks/useTypedSelector'
import React from 'react'
import LoginPage from './pages/auth/login'
import PrivateRoute from './components/UI/Layout/Admin/PrivateRoute'
import Dashboard from './pages/dashboard/dashboard'
import MainIndicators from './pages/key-indicators/main-indicators'
import ProfitAndLost from './pages/key-indicators/profit-lost'
import Capital from './pages/key-indicators/capital'
import LiqPointers from './pages/bank-liquidity/liqudity'
import Correspondent from './pages/bank-liquidity/correspondent'
import CurrencyPosition from './pages/bank-liquidity/currency-position'
import CalcFor from './pages/bank-liquidity/calc-for'
import PlacedAndAttracted from './pages/actives-passives/placed-attracted'
import InterbankDeposits from './pages/actives-passives/interbank-deposits'
import TopDeposits from './pages/actives-passives/top-deposits'
import TimeDepoClients from './pages/actives-passives/time-depo-clients'
import TimeDeposits from './pages/actives-passives/time-deposits'
import DepositsByDeadline from './pages/actives-passives/deposits-by-deadline'
import ReportLiabilities from './pages/actives-passives/report-liabilities'
import GM from './pages/actives-passives/gm'
import GAP from './pages/gap/gap'
import GapSimulation from './pages/admin/gap-simulation'
import NotFound from './pages/not-found'
import InProcess from './pages/in-process/in-process'
import Forbidden from './pages/admin/forbidden'
import AdminRoute from './components/UI/Layout/Admin/AdminRoute'
import Settings from './pages/admin/Settings'
import NostroMatrix from './pages/bank-liquidity/nostro-matrix'
import VlaBuffer from './pages/bank-liquidity/vla-buffer'
import FilialEffectiveness from './pages/actives-passives/filial-effectiviness'
import CompetitiveAnalysis from './pages/actives-passives/competitive-analysis'

function App() {
	const {
		user: { token }
	} = useTypedSelector(state => state.auth)
	return (
		<ErrorBoundary>
			<ThemeProvider theme={theme}>
				<BrowserRouter>
					{token && <Header />}
					<main>
						<Switch>
							<Route component={LoginPage} path="/login" />
							<PrivateRoute component={Dashboard} path="/" exact />
							<PrivateRoute component={MainIndicators} path="/mainIndicators" />
							<PrivateRoute component={Capital} path="/capital" />
							<PrivateRoute component={ProfitAndLost} path="/profitAndLost" />
							<PrivateRoute component={LiqPointers} path="/liquidity" />
							<PrivateRoute component={Correspondent} path="/correspondent" />
							<PrivateRoute component={CalcFor} path="/calcFor" />
							<PrivateRoute component={CurrencyPosition} path="/currencyPosition" />
							<PrivateRoute component={PlacedAndAttracted} path="/plat" />
							<PrivateRoute component={InterbankDeposits} path="/interbankDeposits" />
							<PrivateRoute component={TopDeposits} path="/topDeposits" />
							<PrivateRoute component={TimeDepoClients} path="/timeDepoClients" />
							<PrivateRoute component={TimeDeposits} path="/timeDeposits" />
							<PrivateRoute component={DepositsByDeadline} path="/depositsByDeadline" />
							<PrivateRoute component={ReportLiabilities} path="/reportLiabilities" />
							<PrivateRoute component={NostroMatrix} path="/nostroMatrix" />
							<PrivateRoute component={VlaBuffer} path="/vlaBuffer" />
							<PrivateRoute component={FilialEffectiveness} path="/filialEffectiveness" />
							<PrivateRoute component={CompetitiveAnalysis} path="/competitiveAnalysis" />
							<PrivateRoute component={GM} path="/gm" />
							<PrivateRoute component={GAP} path="/gap" />
							<PrivateRoute component={GapSimulation} path="/gapSimulation" />
							<AdminRoute component={Settings} path="/settings" />
							<PrivateRoute component={Forbidden} path="/403" />
							<PrivateRoute component={InProcess} path={'/in_process/:slug'} />
							<PrivateRoute component={NotFound} />
						</Switch>
					</main>
					{token && <Footer />}
				</BrowserRouter>
				<ToastContainer position="bottom-right" theme="colored" />
			</ThemeProvider>
		</ErrorBoundary>
	)
}

export default App
