import * as React from 'react'
import { IconButton, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import Grid from '@mui/material/Grid'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Button from '@mui/material/Button'

const useStyles = makeStyles((theme) => ({
  alertBox: {
    border: '1px solid black',
    borderRadius: 10,
    padding: '10px 40px',
    maxWidth: '80%',
    margin: '10vh auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    backgroundColor: '#eee'
  },
  reloadBtn: {
    backgroundColor: '#7794aa'
  }
}
))

const ErrorAlert = () => {
  const classes = useStyles()

  function handleClick() {
    localStorage.clear()
    window.location.reload()
  }

  return <>
    <Grid className={classes.alertBox} container>
      <IconButton size="large">
        <ErrorOutlineIcon color="error" fontSize="large"/>
      </IconButton>
      <Typography variant="h4" align="center" color="secondary">
        Что-то пошло не так!
      </Typography>
    </Grid>
    <Typography align="center">
      <Button size="large" variant="outlined" component="span" disabled
        color="secondary">
        Пожалуйста, проверьте подключение.
      </Button>
    </Typography>
    <hr/>
    <Grid container justifyContent="center">
      <Button onClick={handleClick} className={classes.reloadBtn}
        variant="contained">
        Обновить
      </Button>
    </Grid>
  </>
}

export default ErrorAlert
