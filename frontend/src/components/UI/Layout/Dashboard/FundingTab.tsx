import React, {Fragment} from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import {formatNumber} from '../../../../utils'
import CurrencyMFI from '../../../charts/Dashboard/FundingCharts/CurrencyMFI'
import CurrencyMBD from '../../../charts/Dashboard/FundingCharts/CurrencyMBD'
import CurrencyTimeDeposits from '../../../charts/Dashboard/FundingCharts/CurrencyTimeDeposits'
import TimeDepositsChart from '../../../charts/Dashboard/FundingCharts/TimeDepositsChart'
import InterbankDepositsChart from '../../../charts/Dashboard/FundingCharts/InterbankDepositsChart'
import {makeStyles} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  margin: {
    marginBottom: '20px'
  },
  currency: {
    padding: '8px 0',
    fontSize: '12pt',
    color: '#636363'
  },
  grow: theme.mixins.grow,
  liqRate: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: '20px auto'
  },
  greens: {
    color: '#00B050',
    fontSize: '12pt'
  },
  smallCardContainer: theme.mixins.smallCardContainer,
  smallCard: theme.mixins.smallCard,
  liquidityCard: {
    ...theme.mixins.smallCard,
    padding: 0,
    paddingLeft: 5
  },
  horizontalTitle: theme.mixins.oneRowTitle,
  capitalText: {
    padding: 10,
    fontSize: '1.2em',
    fontWeight: 600,
    color: '#555'
  },
  capitalNumber: {
    fontSize: '1.05em'
  },
  noWrap: theme.mixins.noWrap
}))

interface FundingTabProps {
  currencyMfi: any,
  currencyMBD: any,
  currencyTimeDeposits: any,
  timeDeposits: any,
  interbankDeposits: any
}

const FundingTab: React.FC<FundingTabProps> = ({
  currencyMfi = {}, currencyMBD = {},
  currencyTimeDeposits = {}, timeDeposits = {}, interbankDeposits = {}
}) => {
  const classes = useStyles()
  const mfiSum = Number(currencyMfi.reduce((a: any, b: any) => +a + (+b), 0)).toFixed(2)
  const mbdSum = Number(currencyMBD.reduce((a: any, b: any) => +a + (+b), 0)).toFixed(2)
  const currencyTimeDepositsSum = Number(
      currencyTimeDeposits.reduce((a: any, b: any) => +a + (+b), 0)).toFixed(2)
  return (
      <>
        <Fragment>
          {/* CREDIT DEPOSITS */}
          <Grid className={classes.smallCardContainer} container
                justifyContent='space-between'>
            <Grid className={classes.smallCard} item
                  component={Paper}>МФИ &nbsp; <span
                className={classes.greens}>{formatNumber(+mfiSum)} млрд.</span></Grid>
            <Grid className={classes.smallCard} item
                  component={Paper}>МБД &nbsp; <span
                className={classes.greens}>{formatNumber(+mbdSum)} млрд.</span></Grid>
            <Grid className={classes.smallCard} item component={Paper}>Срочные
              депозиты &nbsp;
              <span
                  className={classes.greens}>{formatNumber(
                  +currencyTimeDepositsSum)} млрд.</span></Grid>
          </Grid>
          {/* CREDIT SECOND BAR ROWS */}
          <Grid spacing={2} container justifyContent='space-between'>
            <Grid item sm={6} md={4}>
              <CurrencyMFI series={currencyMfi}/>
            </Grid>
            <Grid item sm={6} md={4}>
              <CurrencyMBD series={currencyMBD}/>
            </Grid>
            <Grid item sm={6} md={4}>
              <CurrencyTimeDeposits series={currencyTimeDeposits}/>
            </Grid>
          </Grid>
          {/*DEPOSITS GRAPHS*/}
          <Grid spacing={2} container justifyContent='space-between'>
            <Grid item sm={6}>
              <TimeDepositsChart series={timeDeposits}/>
            </Grid>
            <Grid item sm={6}>
              <InterbankDepositsChart series={interbankDeposits}/>
            </Grid>
          </Grid>
        </Fragment>
      </>
  )
}

export default FundingTab