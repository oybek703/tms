import React, { Fragment, memo, useEffect } from 'react'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import DashboardMonthly from '../../UI/Layout/DashboardMonthly'
import PlacedAndAttracted from '../Treasury/PlacedAndAttracted'
import CalcFor from '../Treasury/CalcFor'
import WithDetailsButton from '../../UI/Layout/Dashboard/WithDetailsButton'
import Fcrb from '../../UI/Layout/Dashboard/Fcrb'
import Covenants from '../../UI/Layout/Dashboard/Covenants'
import Normatives from '../../UI/Layout/Dashboard/Normatives'
import BankLimits from '../../UI/Layout/Dashboard/BankLimits'
import DailyIndicators from '../../UI/Layout/Dashboard/DailyIndicators'
import CurrencyRatesTab from '../../UI/Layout/Dashboard/DashboardCurrencyRates'
import CapitalTab from '../../UI/Layout/Dashboard/CapitalTab'
import FundingTab from '../../UI/Layout/Dashboard/FundingTab'
import CreditPortfolioTab from '../../UI/Layout/Dashboard/CreditPortfolioTab'
import useTypedSelector from '../../../hooks/useTypedSelector'
import DashboardTabs from '../../UI/Layout/Tabs/DashboardTabs'
import useActions from '../../../hooks/useActions'

const Dashboard = () => {
  const { fetchDashboard } = useActions()
  const { reportDate } = useTypedSelector((state) => state.date)
  const { dashboard, loading, error } = useTypedSelector((state) => state.dashboard)
  const {
    dashboardCorrespondent = {},
    creditPart = [],
    disaggregatedByTime = [],
    dashboardCurrencyPosition = {},
    timeDeposits = [],
    currencyMfi = [],
    currencyTimeDeposits = [],
    issuedCredits = [],
    interbankDeposits = [],
    fundingStructure = [],
    currencyMBD = [],
    vla = {},
    lcr = {},
    nsfr = {},
    currencyRates,
    bankLimits = []
  } = dashboard
  useEffect(() => {
    fetchDashboard(reportDate)
  }, [fetchDashboard, reportDate])
  useEffect(() => {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
  }, [])
  return (
    <Fragment>
      {loading ?
            <Loader/> :
            error ?
                <Alert message={error}/> :
                <>
                  <DashboardTabs
                    tabs={[
                      {
                        name: 'E?????????????????? ????????????????????',
                        panel: <DailyIndicators
                          dashboardCorrespondent={dashboardCorrespondent}
                          lcr={lcr} nsfr={nsfr} vla={vla}
                          dashboardCurrencyPosition={dashboardCurrencyPosition}/>
                      },
                      {
                        name: '?????????? ??????????',
                        panel: <CurrencyRatesTab
                          currencyRates={currencyRates}/>
                      },
                      { name: '??????', panel: <Fcrb/> },
                      {
                        name: '????????????',
                        panel: <BankLimits bankLimits={bankLimits}/>
                      },
                      {
                        name: '??????',
                        panel: <WithDetailsButton link={'/calcfor'}>
                          <CalcFor forDashboard/>
                        </WithDetailsButton>
                      },
                      {
                        name: '???????????? ?? ??????????????',
                        panel: <WithDetailsButton link='/plat'>
                          <PlacedAndAttracted forDashboard/>
                        </WithDetailsButton>
                      },
                      {
                        name: '??????????????',
                        panel: <CapitalTab vla={vla}/>
                      },
                      {
                        name: '????????????????????????',
                        panel: <FundingTab currencyMBD={currencyMBD}
                          currencyMfi={currencyMfi}
                          currencyTimeDeposits={currencyTimeDeposits}
                          interbankDeposits={interbankDeposits}
                          timeDeposits={timeDeposits}/>
                      },
                      {
                        name: '??????????????????',
                        panel: <Normatives/>
                      },
                      {
                        name: '??????????????????', panel: <Covenants/>
                      },
                      {
                        name: '?????????????????? ????????????????',
                        panel: <CreditPortfolioTab creditPart={creditPart}
                          issuedCredits={issuedCredits}
                          disaggregatedByTime={disaggregatedByTime}
                          fundingStructure={fundingStructure}/>
                      },
                      { name: 'Dashboard', panel: <DashboardMonthly/> }
                    ]}/>
                </>
      }
    </Fragment>
  )
}

export default memo(Dashboard)
