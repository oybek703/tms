import { ThemeProvider } from '@mui/material/styles'
import theme from './components/theme'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Header from './components/layout/Navigation/Header'
import './App.css'
import ErrorBoundary from './components/errorBoundary/ErrorBoundary'
import Footer from './components/layout/Navigation/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useTypedSelector from './hooks/useTypedSelector'
import React from 'react'
import LoginPage from './pages/auth/Login'
import PrivateRoute from './components/layout/Admin/PrivateRoute'
import Dashboard from './pages/dashboard/Dashboard'
import MainIndicators from './pages/keyIndicators/MainIndicators'
import ProfitAndLost from './pages/keyIndicators/ProfitLost'
import Capital from './pages/keyIndicators/Capital'
import LiqPointers from './pages/bankLiquidity/Liqudity'
import Correspondent from './pages/bankLiquidity/Correspondent'
import CurrencyPosition from './pages/bankLiquidity/CurrencyPosition'
import CalcFor from './pages/bankLiquidity/CalcFor'
import PlacedAndAttracted from './pages/activesPassives/PlacedAttracted'
import InterbankDeposits from './pages/activesPassives/InterbankDeposits'
import TopDeposits from './pages/activesPassives/TopDeposits'
import TimeDepoClients from './pages/activesPassives/TimeDepoClients'
import TimeDeposits from './pages/activesPassives/TimeDeposits'
import DepositsByDeadline from './pages/activesPassives/DepositsByDeadline'
import ReportLiabilities from './pages/activesPassives/ReportLiabilities'
import GM from './pages/activesPassives/GM'
import GAP from './pages/gap/Gap'
import GapSimulation from './pages/gap/gapSimulation'
import NotFound from './pages/NotFound'
import InProcess from './pages/inProcess/InProcess'
import Forbidden from './pages/admin/Forbidden'
import AdminRoute from './components/layout/Admin/AdminRoute'
import Settings from './pages/admin/settings'
import NostroMatrix from './pages/bankLiquidity/NostroMatrix'
import VlaBuffer from './pages/bankLiquidity/VlaBuffer'
import FilialEffectiveness from './pages/activesPassives/FilialEffectiviness'
import CompetitiveAnalysis from './pages/activesPassives/CompetitiveAnalysis'
import CorrAccountsAnalyze from './pages/dealingOperations/CorrAccountsAnalyze'
import CAAManual from './pages/dealingOperations/CAAManual'

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
							<PrivateRoute component={CorrAccountsAnalyze} path="/corrAccountsAnalyze" />
							<PrivateRoute component={CAAManual} path="/caaManual" />
							<PrivateRoute component={GM} path="/gm" />
							<PrivateRoute component={GAP} path="/gap" />
							<PrivateRoute component={GapSimulation} path="/gapManual" />
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
