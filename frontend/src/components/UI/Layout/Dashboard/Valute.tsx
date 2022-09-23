import React from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import { Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import CardActions from '@mui/material/CardActions'
import FormattedCell from '../../helpers/FormattedCell/FormattedCell'
import { formatNumber } from '../../../../utils'

const useStyles = makeStyles((theme) => ({
  box: {
    flexBasis: '24.6%',
    margin: '-10px 0'
  }
}))

interface ValuteProps {
    number: number
    differ: number
    image: string
}

const Valute: React.FC<ValuteProps> = ({ number = 0, differ = 0, image = 'uzs' }) => {
  const classes = useStyles()
  return (
    <Grid item className={classes.box} component={Card}>
      <Grid container justifyContent='space-around' alignItems='center'>
        <Grid item xs={8}>
          <CardContent style={{ padding: '5px 10px' }}>
            <Typography style={{ fontSize: '1.8rem', marginLeft: 10 }} component='h2' color='inherit'>
              {formatNumber(+number)} {image === 'uzs' ? 'млрд' : 'млн'}
            </Typography>
          </CardContent>
          <CardActions>
            <FormattedCell alignText='flex-start' number={differ} textVar='h6' iconSize='large'
              curr={image === 'uzs' ? 'млрд' : 'млн'}/>
          </CardActions>
        </Grid>
        <Grid item xs={4} container justifyContent='space-evenly'>
          <h1 style={{ color: '#666', fontSize: '2.5rem' }}>{image.toUpperCase()}</h1>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Valute
