import React from 'react'
import {Button, makeStyles} from '@material-ui/core'
import AutorenewIcon from '@material-ui/icons/Autorenew'
import './reloadBtn.css'
import {useDispatch, useSelector} from 'react-redux'
import {fetchDashboard, getLastUpdateTime} from '../../../../redux/actions'

const useStyles = makeStyles(theme => ({
    btn: {
        marginTop: 3,
        height: 38
    }
}))

const ReloadBtn = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const {reportDate} = useSelector(state => state.date)
    const {loading} = useSelector(state => state.dashboard)
    function handleClick() {
        localStorage.removeItem('dashboard')
        localStorage.removeItem('fcrb')
        localStorage.removeItem('calcfor')
        localStorage.removeItem('plat')
        dispatch(getLastUpdateTime())
        dispatch(fetchDashboard(reportDate))
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