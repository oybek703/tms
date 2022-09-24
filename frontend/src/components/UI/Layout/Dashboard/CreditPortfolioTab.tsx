import React, { Fragment, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { formatNumber } from '../../../../utils'
import CreditPortfolio from '../../../charts/Dashboard/CreditPortfolioCharts/RiskPart/CreditPortfolio'
import CPBreakdown from '../../../charts/Dashboard/CreditPortfolioCharts/RiskPart/CPBreakdown'
import FundingStructure from '../../../charts/Dashboard/CreditPortfolioCharts/FundingStructure'
import makeStyles from '@mui/styles/makeStyles'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import useActions from '../../../../hooks/useActions'
import Loader from '../Loader'
import Alert from '../Alert'

const useStyles = makeStyles(theme => ({
  greens: {
    color: '#00B050',
    fontSize: '12pt'
  },
  smallCardContainer: theme.mixins.smallCardContainer,
  smallCard: theme.mixins.smallCard,
  horizontalTitle: theme.mixins.oneRowTitle
}))

const CreditPortfolioTab = () => {
  const classes = useStyles()
  const { fetchDashboardCreditData } = useActions()
  const { reportDate } = useTypedSelector(state => state.date)
  const { creditData, error, loading } = useTypedSelector(state => state.creditData)
  const { dashboard, error: dashboardError, loading: dashboardLoading } = useTypedSelector(state => state.dashboard)
  const { disaggregatedByTime = [], creditPart = [], issuedCredits = [] } = creditData
  const { fundingStructure = [] } = dashboard
  useEffect(() => {
    fetchDashboardCreditData(reportDate)
  }, [fetchDashboardCreditData, reportDate])
  return (
    <Fragment>
      {(loading || dashboardLoading) ?
          <Loader/> :
          (error || dashboardError) ?
            <Alert message={error || dashboardError}/> : <Grid>
              {/* Выдача кредитов */}
              <Grid container justifyContent='center'>
                <Grid
                  className={classes.horizontalTitle}
                  container justifyContent='center'
                  component={Paper}>
                  Выдача кредитов
                </Grid>
                <Grid
                  className={classes.smallCardContainer}
                  container>
                  {['UZS', 'USD', 'EUR'].map(
                      (v, i) => (
                        <Grid
                          className={classes.smallCard}
                          key={i}
                          item
                          component={Paper}>{v} &nbsp;
                          <span className={classes.greens}>{formatNumber(issuedCredits[i])} {i === 0 ? 'млрд.' : 'млн.'} </span>
                        </Grid>
                      ))}
                </Grid>
              </Grid>
              {/* Выдача кредитов COLS */}
              <Grid
                className={classes.horizontalTitle}
                container
                justifyContent='center'
                component={Paper}>
                <span>Качество кредитного портфеля</span>
              </Grid>
              {/* Качество кредитного портфеля CHARTS */}
              <br/>
              <Grid spacing={2} container
                justifyContent='space-between'>
                <Grid item sm={6} md={4}>
                  <CreditPortfolio
                    series={creditPart.slice(
                        1)}/>
                </Grid>
                <Grid item sm={6} md={4}>
                  <CPBreakdown
                    series={disaggregatedByTime}/>
                </Grid>
                <Grid item sm={6} md={4}>
                  <FundingStructure
                    series={fundingStructure}/>
                </Grid>
              </Grid>
              {/* Качество кредитного портфеля NUMBERS */}
              <Grid
                className={classes.smallCardContainer}
                container>
                {['КП', 'NPL', 'ПР'].map((v, i) => (
                  <Grid key={i}
                    className={classes.smallCard}
                    item component={Paper}>
                    <span>{v} &nbsp;</span>
                    <span
                      className={classes.greens}>{formatNumber(+creditPart[i])} млн.</span>
                  </Grid>
                ))}
              </Grid>
            </Grid> }
    </Fragment>
  )
}

export default CreditPortfolioTab
