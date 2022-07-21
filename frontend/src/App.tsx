import { ThemeProvider } from '@material-ui/styles'
import theme from './components/UI/theme'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Header from './components/UI/Layout/Navigation/Header'
import './App.css'
import ErrorBoundary from './components/ErrorBoundary.js/ErrorBoundary'
import Footer from './components/UI/Layout/Navigation/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useTypedSelector from './hooks/useTypedSelector'
import React from 'react'
import LoginPage from './components/pages/Auth/Login'
import PrivateRoute from './components/UI/Layout/Admin/PrivateRoute'
import Dashboard from './components/pages/Analytics/Dashboard'

function App () {
    const { user: { token } } = useTypedSelector(state => state.auth)
    return (
        <ErrorBoundary>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    {token && <Header/>}
                    <main>
                        <Switch>
                            <Route component={LoginPage} path='/login'/>
                            <PrivateRoute component={Dashboard} path='/' exact/>
                            {/*    <PrivateRoute component={MainIndicators} path='/mainindicators'/>*/}
                            {/*    <PrivateRoute component={ProfitAndLost} path='/profitandlost'/>*/}
                            {/*    <PrivateRoute component={Capital} path='/capital'/>*/}
                            {/*    <PrivateRoute component={LiqPointers} path='/liquidity'/>*/}
                            {/*    <PrivateRoute component={Correspondent} path='/correspondent'/>*/}
                            {/*    <PrivateRoute component={CurrencyPosition} path='/currencyposition'/>*/}
                            {/*    <PrivateRoute component={CalcFor} path='/calcfor'/>*/}
                            {/*    <PrivateRoute component={GM} path='/gm'/>*/}
                            {/*    <PrivateRoute component={InterbankDeposits} path='/interbankdeposits'/>*/}
                            {/*    <PrivateRoute component={PlacedAndAttracted} path='/plat'/>*/}
                            {/*    <PrivateRoute component={TopDeposits} path='/topdeposits'/>*/}
                            {/*    <PrivateRoute component={TimeDepoClients} path='/timedepoclients'/>*/}
                            {/*    <PrivateRoute component={TimeDeposits} path='/timedeposits'/>*/}
                            {/*    <PrivateRoute component={DepositsByDeadline} path='/depositsbydeadline'/>*/}
                            {/*    <PrivateRoute component={ReportLiabilities} path='/reportliabilities'/>*/}
                            {/*    <PrivateRoute component={GAP} path='/gap'/>*/}
                            {/*    <PrivateRoute component={GapSimulation} path='/gapsimulation'/>*/}
                            {/*    <AdminRoute component={Settings} path='/settings'/>*/}
                            {/*    <PrivateRoute component={Forbidden} path='/403'/>*/}
                            {/*    <PrivateRoute component={InProcess} path={'/in_process/:slug'}/>*/}
                            {/*    <PrivateRoute component={NotFound}/>*/}
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
