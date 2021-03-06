import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid, { GridJustification } from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core'
import { formatNumber } from '../../../../../utils'
import StopIcon from '@material-ui/icons/Stop'

const useStyles = makeStyles((theme) => ({
  grow: theme.mixins.grow,
  noWrap: {
    ...theme.mixins.noWrap,
    flexWrap: 'nowrap'
  },
  blackText: {
    color: '#000'
  },
  yellowText: {
    color: '#ecd100'
  }
}))

interface PercentIndicatorProps {
    number: number
    alignText?: GridJustification
    total?: boolean
}

const PercentIndicator: React.FC<PercentIndicatorProps> = ({ number, alignText = 'center', total = false }) => {
  const classes = useStyles()
  return (
    <Grid className={classes.noWrap} container component='span' alignItems='center'
      justifyContent={alignText}>
      {
                total ?
                    (
                        (number >= -6.99 && number <= 6.99) ?
                            <StopIcon className={classes.grow}/> :
                            ((number >= 7 && number <= 10.99) || (number >= -10.99 && number <= -7) ?
                                <StopIcon className={classes.yellowText}/> :
                                (number >= 11 || number <= -11) && <StopIcon color='error'/>)) :
                    (
                        (number >= -4.99 && number <= 4.99) ?
                        <StopIcon className={classes.grow}/> :
                        (number > 5 && number <= 6.99) || (number >= -6.99 && number <= -5) ?
                            <StopIcon className={classes.yellowText}/> :
                            (number > 7 || number < -7) && <StopIcon color='error'/>)
      }
      {<Typography variant='caption'
        className={classes.blackText}>
        <b>{formatNumber(number)}%</b>
      </Typography>}
    </Grid>
  )
}

export default PercentIndicator
