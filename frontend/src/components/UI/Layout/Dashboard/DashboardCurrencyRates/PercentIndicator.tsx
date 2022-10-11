import React from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import makeStyles from '@mui/styles/makeStyles'
import { formatNumber } from '../../../../../utils'
import StopIcon from '@mui/icons-material/Stop'

const useStyles = makeStyles(theme => ({
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
    alignText?: string
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
                        (number >= -7.99 && number <= 7.99) ?
                            <StopIcon className={classes.grow}/> :
                            ((number >= 8 && number <= 10.99) || (number >= -10.99 && number <= -8) ?
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
