import React from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core'
import { formatDate, formatNumber, formatOneDate } from '../../../../utils'
import theme from '../../theme'
import useTypedSelector from '../../../../hooks/useTypedSelector'

const useStyles = makeStyles({
  greens: {
    color: '#00B050',
    fontSize: '1.2em'
  },
  liquidityCard: {
    ...theme.mixins.smallCard,
    padding: 0,
    paddingLeft: 2,
    marginBottom: -5,
    paddingBottom: 5
  },
  totalText: {
    fontSize: '1.5em',
    fontWeight: 550,
    textAlign: 'left',
    padding: 0
  },
  totalSecondaryText: {
    fontSize: '1.5em',
    textAlign: 'left',
    padding: 0
  },
  totalValue: {
    fontWeight: 500,
    fontSize: '1.4em'
  },
  secondaryText: {
    lineHeight: 0,
    color: '#000',
    fontSize: '0.8em',
    fontWeight: 700,
    marginTop: 5
  },
  natValue: {
    fontSize: '1.3em',
    fontWeight: 400
  },
  labelPart: {
    borderRight: '2px dashed #ddd'
  },
  mainText: {
    transform: 'translateY(4px)'
  },
  wrapperCard: {
    position: 'relative'
  },
  stateCard: {
    position: 'absolute',
    left: -2,
    bottom: -6,
    background: '#7794aa',
    fontSize: '0.65em',
    fontWeight: 'bold',
    color: 'white',
    padding: 0.1
  }
})

interface LiquidityCardProps {
    data: any
    label: string
}

function StateCard() {
  const classes = useStyles()
  return <span className={classes.stateCard}>
          Текущие состояние
  </span>
}

const LiquidityCard: React.FC<LiquidityCardProps> = ({ data = [], label = 'ВЛА' }) => {
  const [lastTotal, lastNat, lastForeign] = data
  const { reportDate } = useTypedSelector(state => state.date)
  const isToday = formatOneDate(reportDate) === formatOneDate(new Date().toString())
  const classes = useStyles()
  const splittedLabel = label.split(' ')
  return (
    <Grid className={classes.liquidityCard} item component={Paper} variant='outlined'>
      <Grid container className={classes.wrapperCard} justifyContent='space-between' alignItems='center'>
        {isToday && label === 'ЮЛА (HQLA)' && <StateCard/>}
        <Grid item xs={6}>
          <Grid container justifyContent='space-around'
            alignItems='baseline' className={classes.labelPart}>
            <Grid item className={classes.mainText}>
              <span className={classes.totalText}>{splittedLabel[0]}</span> {' '}
              <span className={classes.totalSecondaryText}>{splittedLabel[1]}</span>
            </Grid>
            <Grid item>
              {lastTotal && <ListItemText
                primary={<b className={`${classes.greens} ${classes.totalValue}`}>{formatNumber(lastTotal)}%</b>}
                secondaryTypographyProps={{ className: classes.secondaryText }}
                secondary='итого'/>}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid container spacing={1} justifyContent='space-between' alignItems='center'>
            <Grid item xs={6}>
              {lastNat && <ListItemText primary={<b
                className={`${classes.greens} ${classes.natValue}`}>{formatNumber(lastNat)}%</b>}
              secondaryTypographyProps={{ className: classes.secondaryText }}
              secondary='нац.валюта'/>}
            </Grid>
            <Grid item xs={6}>
              {lastForeign && <ListItemText primary={<b
                className={`${classes.greens} ${classes.natValue}`}>{formatNumber(lastForeign)}%</b>}
              secondaryTypographyProps={{ className: classes.secondaryText }}
              secondary='ин.валюта'/>}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default LiquidityCard
