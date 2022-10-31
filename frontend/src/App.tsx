import { ThemeProvider } from '@mui/material/styles'
import theme from './components/UI/theme'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Header from './components/UI/Layout/Navigation/Header'
import './App.css'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import Footer from './components/UI/Layout/Navigation/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useTypedSelector from './hooks/useTypedSelector'
import React from 'react'
import LoginPage from './pages/Auth/Login'
import PrivateRoute from './components/UI/Layout/Admin/PrivateRoute'
import Dashboard from './pages/Analytics/Dashboard'
import MainIndicators from './pages/Treasury/MainIndicators'
import ProfitAndLost from './pages/Treasury/ProfitAndLost'
import Capital from './pages/Treasury/Capital'
import LiqPointers from './pages/Treasury/LiqPointers'
import Correspondent from './pages/Treasury/Correspondent'
import CurrencyPosition from './pages/Treasury/CurrencyPosition'
import CalcFor from './pages/Treasury/CalcFor'
import PlacedAndAttracted from './pages/Treasury/PlacedAndAttracted'
import InterbankDeposits from './pages/Treasury/InterbankDeposits'
import TopDeposits from './pages/Treasury/TopDeposits'
import TimeDepoClients from './pages/Treasury/TimeDepoClients'
import TimeDeposits from './pages/Treasury/TimeDeposits'
import DepositsByDeadline from './pages/Analytics/DepositsByDeadline'
import ReportLiabilities from './pages/Analytics/ReportLiabilities'
import GM from './pages/Treasury/GM'
import GAP from './pages/Analytics/GAP'
import GapSimulation from './pages/Admin/GapSimulation'
import NotFound from './pages/NotFound'
import InProcess from './pages/InProcess'
import Forbidden from './pages/Admin/Forbidden'
import AdminRoute from './components/UI/Layout/Admin/AdminRoute'
import Settings from './pages/Admin/Settings'
import NostroMatrix from './pages/Analytics/NostroMatrix'
import VlaBuffer from './pages/Analytics/VlaBuffer'
import FilialEffectiveness from './pages/Analytics/FilialEffectiveness'

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
							<PrivateRoute component={MainIndicators} path="/mainindicators" />
							<PrivateRoute component={Capital} path="/capital" />
							<PrivateRoute component={ProfitAndLost} path="/profitandlost" />
							<PrivateRoute component={LiqPointers} path="/liquidity" />
							<PrivateRoute component={Correspondent} path="/correspondent" />
							<PrivateRoute component={CalcFor} path="/calcfor" />
							<PrivateRoute component={CurrencyPosition} path="/currencyposition" />
							<PrivateRoute component={PlacedAndAttracted} path="/plat" />
							<PrivateRoute component={InterbankDeposits} path="/interbankdeposits" />
							<PrivateRoute component={TopDeposits} path="/topdeposits" />
							<PrivateRoute component={TimeDepoClients} path="/timedepoclients" />
							<PrivateRoute component={TimeDeposits} path="/timedeposits" />
							<PrivateRoute component={DepositsByDeadline} path="/depositsbydeadline" />
							<PrivateRoute component={ReportLiabilities} path="/reportliabilities" />
							<PrivateRoute component={NostroMatrix} path="/nostroMatrix" />
							<PrivateRoute component={VlaBuffer} path="/vlaBuffer" />
							<PrivateRoute component={FilialEffectiveness} path="/filialEffectiveness" />
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
