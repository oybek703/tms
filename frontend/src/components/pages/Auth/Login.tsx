import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Button, CardContent, IconButton } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import CircularProgress from '@mui/material/CircularProgress'
import { Redirect } from 'react-router-dom'
import { parse } from 'query-string'
import { toast } from 'react-toastify'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'

const useStyles = makeStyles((theme) => ({
  darkText: {
    color: '#000'
  },
  boldText: {
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  formFields: {
    minWidth: '40em',
    margin: '1em auto 2.5em',
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      minWidth: '25em'
    }
  },
  form: {
    backgroundColor: 'white',
    padding: '30px 20px'
  },
  root: {
    margin: '50px auto'
  },
  submit_btn: {
    backgroundColor: theme.palette.success['main']
  },
  submit_end_icon: {
    color: theme.palette.error['main']
  },
  logo: {
    marginTop: -80,
    marginBottom: -60
  }
}))

const LoginPage = () => {
  const classes = useStyles()
  const { signInUser } = useActions()
  const { user: { token }, loading, error } = useTypedSelector(
      (state) => state.auth)
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [usernameHelperText, setUsernameHelperText] = useState('')
  const [passwordHelperText, setPasswordHelperText] = useState('')
  const [btnDisabled, setBtnDisabled] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const { redirectTo } = parse(window.location.search)
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    switch (name) {
      case 'username':
                /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(value) ?
                  setUsernameHelperText('') :
                  setUsernameHelperText('Please enter valid username.')
        break
      case 'password':
                value.length >= 6 ?
                  setPasswordHelperText('') :
                    setPasswordHelperText('Password should contain at least 6 characters.')
        break
      default:
        return
    }
  }
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signInUser(formData)
  }
  useEffect(() => {
    const btnStatus = !!formData.username && !!formData.password && !loading
    setBtnDisabled(!btnStatus)
    // eslint-disable-next-line
    }, [formData, loading])
  useEffect(() => {
    if (error) {
      switch (error) {
        case 'Invalid username.':
          setUsernameHelperText('User not found or deleted.')
          break
        case 'Invalid password.':
          setPasswordHelperText('Invalid user password.')
          break
        default:
          toast.error(error, { position: 'bottom-center' })
      }
    }
  }, [error])
  if (token) { // @ts-ignore
    return <Redirect to={(redirectTo === '/' || !redirectTo) ? '/' : redirectTo}/>
  }
  return (
    <Grid container direction='column' alignItems='center' justifyContent='center'
      className={classes.root}>
      <Grid item>
        <Grid className={classes.logo}>
          <Grid>
            <img src={process.env.PUBLIC_URL + '/asakabank.jpg'}
              width='350' height='300' alt="Treasury Reports"/>
          </Grid>
        </Grid>
        <br/>
      </Grid>
      <Grid item>
        <Typography
          className={`${classes.darkText} ${classes.boldText}`}
          variant='h5' gutterBottom align='center'>
                    Treasury Management System
        </Typography>
      </Grid>
      <Grid item>
        <Card classes={{ root: classes.form }} elevation={12}
          variant='elevation'>
          <CardContent>
            <form onSubmit={handleSubmit} autoComplete='on' autoSave='on'>
              <Grid container className={classes.formFields}
                justifyContent='center'>
                <TextField
                  error={!!usernameHelperText}
                  helperText={usernameHelperText}
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  variant='outlined' fullWidth
                  label='Username*'/>
              </Grid>
              <Grid container className={classes.formFields}
                justifyContent='center'>
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  error={!!passwordHelperText}
                  helperText={passwordHelperText}
                  name='password' value={formData.password}
                  onChange={handleChange} variant='outlined'
                  fullWidth label='Password*'
                  InputProps={{
                    endAdornment: <IconButton size='small'
                      onClick={() => setShowPassword(
                          !showPassword)}>{showPassword ?
                                            <Visibility fontSize='small'/> :
                                            <VisibilityOff
                                              fontSize='small'/>}</IconButton>
                  }}/>
              </Grid>
              <Grid container justifyContent='center'>
                <Button type='submit'
                  disabled={btnDisabled}
                  size='large'
                  variant='contained' fullWidth
                  className={classes.submit_btn}
                  endIcon={loading && <CircularProgress
                    className={classes.submit_end_icon}
                    size='20px'/>}>
                                    Sign In
                </Button>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default LoginPage
