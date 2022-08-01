import React from 'react'
import { Link, makeStyles, Typography } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Spaces from '../../helpers/FormattedCell/Spaces'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    color: '#424040',
    borderRadius: 0,
    width: '100%',
    padding: '10px 40px',
    marginTop: 10,
    borderLeft: 0,
    borderRight: 0
  },
  link: {
    'cursor': 'pointer',
    '&:hover': {
      textDecoration: 'none'
    }
  }
}))

const Footer = () => {
  const classes = useStyles()
  return (
    <Paper variant='outlined' component='footer' elevation={0} className={classes.root}>
      <Grid item>
        <Typography variant='body1' className={classes.link} href='#'
          align='center' component={Link}>
                    Support <Spaces count={5}/>
        </Typography>
        <Typography variant='body1' className={classes.link} href='#'
          align='center' component={Link}>Help</Typography>
      </Grid>
      <Grid item>
        <Typography variant='body1' align='center'> Asakabank - © 2022</Typography>
      </Grid>
    </Paper>
  )
}

export default Footer
