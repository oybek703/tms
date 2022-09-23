import React from 'react'
import Grid from '@mui/material/Grid'
import './loader.css'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles((theme) => ({
  loaderContent: {
    margin: '0 auto',
    minHeight: 550,
    width: '60%',
    background: '#ffffff'
  }
}))

const Loader = () => {
  const classes = useStyles()
  return (
    <Grid className={classes.loaderContent} justifyContent='center'
      container alignItems='center'>
      <div className="loader quantum-spinner"/>
    </Grid>
  )
}

export default Loader
