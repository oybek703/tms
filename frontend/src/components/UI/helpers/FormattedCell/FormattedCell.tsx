import React from 'react'
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined'
import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined'
import Typography from '@material-ui/core/Typography'
import Grid, { GridJustification } from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core'
import { formatNumber } from '../../../../utils'
import { Variant } from '@material-ui/core/styles/createTypography'

const useStyles = makeStyles((theme) => ({
  grow: theme.mixins.grow,
  down: theme.mixins.down,
  noWrap: {
    ...theme.mixins.noWrap,
    flexWrap: 'nowrap'
  }
}))

interface FormattedCellProps {
    number: number
    textVar?: Variant
    curr?: string
    alignText?: GridJustification
    iconSize?: 'default' | 'inherit' | 'large' | 'medium' | 'small'
    dashForZero?: boolean
}

const FormattedCell: React.FC<FormattedCellProps>= ({ number, textVar = 'caption',
  curr = '', alignText = 'center',
  iconSize = 'medium', dashForZero = false }) => {
  const classes = useStyles()
  if (dashForZero && number === 0) return <>{'-'}</>
  return (
    <Grid className={classes.noWrap} container component='span' alignItems='center'
      justifyContent={alignText} >
      {
                number<0 ?
                <ArrowDropDownOutlinedIcon color='error' fontSize={iconSize} /> :
                <ArrowDropUpOutlinedIcon className={classes.grow} fontSize={iconSize}/>}
      {<Typography variant={`${textVar}`} component='b'
        className={number<0 ? classes.down : classes.grow}>
        {formatNumber(Math.abs(number))} {curr}
      </Typography>}
    </Grid>
  )
}

export default FormattedCell
