import React, { Fragment } from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { v4 as uuid } from 'uuid'
import CurrencyRateLine from './CurrencyRateLine'
import { makeStyles } from '@material-ui/core'
import { DashboardCurrencyRates, ExternalCurrencyRates } from './CurrencyRateTables'

const useStyles = makeStyles((theme) => ({
  currency: {
    padding: '8px 0',
    fontSize: '12pt',
    color: '#636363'
  },
  smallCardContainer: theme.mixins.smallCardContainer,
  smallCard: theme.mixins.smallCard,
  horizontalTitle: theme.mixins.oneRowTitle
}))

interface CurrencyRatesTabProps {
    currencyRates: any
}

const CurrencyRatesTab: React.FC<CurrencyRatesTabProps> = ({ currencyRates = {} }) => {
  const classes = useStyles()
  const { cbRate = [], legalEntitiesRates = [], individualsRates = [], last90Rates = {} } = currencyRates
  return (
    <Fragment>
      <Grid container justifyContent='center' component={Paper}
        className={classes.horizontalTitle}>Курсы валют</Grid>
      <br/>
      {/* CURRENCY RATES*/}
      <Grid className={classes.smallCardContainer} container
        justifyContent='space-between'>
        {['Курсы ЦБ', 'Курсы для юр. лиц', 'Курсы для физ. лиц'].map(
            (title) => <Grid component={Paper}
              item
              key={uuid()}
              xs={12} sm={6} md={4}
              className={`${classes.smallCard} ${classes.horizontalTitle}`}>
              {title}
            </Grid>)}
      </Grid>
      <Grid container justifyContent='space-between'
        className={classes.smallCardContainer}>
        <Grid item xs={12} sm={6} className={classes.smallCard}
          md={4} component={Paper}>
          <DashboardCurrencyRates cbRate={cbRate}/>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.smallCard}
          md={4} component={Paper}>
          <ExternalCurrencyRates rates={legalEntitiesRates}/>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.smallCard}
          md={4} component={Paper}>
          <ExternalCurrencyRates rates={individualsRates}/>
        </Grid>
      </Grid>
      <CurrencyRateLine last90Rates={last90Rates}/>
    </Fragment>
  )
}

export default CurrencyRatesTab
