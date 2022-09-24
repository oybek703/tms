import React from 'react'
import { Button } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import './reloadBtn.css'
import useActions from '../../../../hooks/useActions'
import useTypedSelector from '../../../../hooks/useTypedSelector'

const useStyles = makeStyles(theme => ({
  btn: {
    height: 38
  }
}))

const ReloadBtn = () => {
  const classes = useStyles()
  const { fetchDashboard, getLastUpdateTime } = useActions()
  const { reportDate } = useTypedSelector(state => state.date)
  const { loading } = useTypedSelector(state => state.dashboard)
  function handleClick() {
    localStorage.removeItem('dashboard')
    localStorage.removeItem('fcrb')
    localStorage.removeItem('calcfor')
    localStorage.removeItem('plat')
    localStorage.removeItem('creditData')
    getLastUpdateTime()
    fetchDashboard(reportDate)
  }
  return (
    <Button onClick={handleClick} className={classes.btn} size='medium'
      title='Обновить данные страницы'
      disabled={loading} variant='outlined' color='primary'>
      <AutorenewIcon className={`${loading ? 'rotate' : ''}`}/>
    </Button>
  )
}

export default ReloadBtn
