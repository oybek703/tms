import React from 'react'
import { ThemeProvider } from '@material-ui/styles'
import theme from './components/UI/theme'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import MainIndicators from './components/pages/Treasury/MainIndicators'
import LiqPointers from './components/pages/Treasury/LiqPointers'
import NotFound from './components/pages/NotFound'
import Dashboard from './components/pages/Analytics/Dashboard'
import Header from './components/UI/Layout/Navigation/Header'
import './App.css'
import ErrorBoundary from './components/ErrorBoundary.js/ErrorBoundary'
import Capital from './components/pages/Treasury/Capital'
import Correspondent from './components/pages/Treasury/Correspondent'
import ProfitAndLost from './components/pages/Treasury/ProfitAndLost'
import Footer from './components/UI/Layout/Navigation/Footer'
import CurrencyPosition from './components/pages/Treasury/CurrencyPosition'
import LoginPage from './components/pages/Auth/Login'
import PrivateRoute from './components/UI/Layout/Admin/PrivateRoute'
import { useSelector } from 'react-redux'
import Settings from './components/pages/Admin/Settings'
import Forbidden from './components/pages/Admin/Forbidden'
import CalcFor from './components/pages/Treasury/CalcFor'
import GM from './components/pages/Treasury/GM'
import PlacedAndAttracted from './components/pages/Treasury/PlacedAndAttracted'
import TopDeposits from './components/pages/Treasury/TopDeposits'
import InterbankDeposits from './components/pages/Treasury/InterbankDeposits'
import TimeDepoClients from './components/pages/Treasury/TimeDepoClients'
import TimeDeposits from './components/pages/Treasury/TimeDeposits'
import DepositsByDeadline from './components/pages/Analytics/DepositsByDeadline'
import ReportLiabilities from './components/pages/Analytics/ReportLiabilities'
import GAP from './components/pages/Analytics/GAP'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import InProcess from './components/pages/InProcess'
import GapSimulation from './components/pages/Admin/GapSimulation'

function App () {
  const { user: { token } } = useSelector(state => state.auth)
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {token && <Header/>}
          <main>
              <Switch>
                  <Route component={LoginPage} path='/login'/>
                  <PrivateRoute component={Dashboard} path='/' exact/>
                  <PrivateRoute component={MainIndicators} path='/mainindicators'/>
                  <PrivateRoute component={ProfitAndLost} path='/profitandlost'/>
                  <PrivateRoute component={Capital} path='/capital'/>
                  <PrivateRoute component={LiqPointers} path='/liquidity'/>
                  <PrivateRoute component={Correspondent} path='/correspondent'/>
                  <PrivateRoute component={CurrencyPosition} path='/currencyposition'/>
                  <PrivateRoute component={CalcFor} path='/calcfor'/>
                  <PrivateRoute component={GM} path='/gm'/>
                  <PrivateRoute component={InterbankDeposits} path='/interbankdeposits'/>
                  <PrivateRoute component={PlacedAndAttracted} path='/plat'/>
                  <PrivateRoute component={TopDeposits} path='/topdeposits'/>
                  <PrivateRoute component={TimeDepoClients} path='/timedepoclients'/>
                  <PrivateRoute component={TimeDeposits} path='/timedeposits'/>
                  <PrivateRoute component={DepositsByDeadline} path='/depositsbydeadline'/>
                  <PrivateRoute component={ReportLiabilities} path='/reportliabilities'/>
                  <PrivateRoute component={GAP} path='/gap'/>
                  <PrivateRoute component={GapSimulation} path='/gapsimulation'/>
                  <PrivateRoute component={Settings} path='/settings'/>
                  <PrivateRoute component={Forbidden} path='/403'/>
                  <PrivateRoute component={InProcess} path={'/in_process/:slug'}/>
                  <PrivateRoute component={NotFound}/>
              </Switch>
          </main>
          {token && <Footer/>}
        </BrowserRouter>
        <ToastContainer position='bottom-right' theme='colored'/>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
