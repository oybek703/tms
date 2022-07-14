import React, {Fragment, useCallback, useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core'
import {useDispatch, useSelector} from 'react-redux'
import {findRecursive, formatDate, formatDateWithDash, formatOneDate} from '../../../../utils'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import {toast} from 'react-toastify'
import Loader from '../Loader'
import Alert from '../Alert'
import DashboardMonthlyTable from './DashboardMonthlyTable'
import {fetchDashboardMonthly} from '../../../../redux/actions'

const useStyles = makeStyles(theme => ({
    root: theme.mixins.main_body,
    optionBlock: {
        maxWidth: 600
    }
}))

const DashboardMonthly = () => {
    const dispatch = useDispatch()
    const {reportDate} = useSelector(state => state.date)
    const [dateOption, setDateOption] = useState('two')
    const {operDays, loading: operDaysLoading} = useSelector(state => state.operDays)
    const dayBefore = formatDateWithDash(findRecursive(operDays, reportDate))
    const {dashboardMonthly, loading, error} = useSelector(state => state.dashboardMonthly)
    const [firstDate, setFirstDate] = useState(dayBefore)
    const [secondDate, setSecondDate] = useState(dayBefore)
    useEffect(() => {
        if (firstDate && secondDate && firstDate !== secondDate) {
            dispatch(fetchDashboardMonthly(new Date(firstDate), new Date(secondDate), dateOption))
        }
    }, [dispatch, firstDate, secondDate, dateOption])
    useEffect(() => {
        let {selectedDate: newSecondDate} = formatDate(reportDate, true)
        const isReportDateToday = formatOneDate(reportDate) === formatOneDate(new Date())
        if (isReportDateToday) {
            newSecondDate = formatDateWithDash(findRecursive(operDays, reportDate))
            const newFirstDate = formatDateWithDash(findRecursive(operDays, newSecondDate))
            setSecondDate(newSecondDate)
            setFirstDate(newFirstDate)
        } else {
            setFirstDate(dayBefore)
            setSecondDate(newSecondDate)
        }
        setDateOption('two')
    }, [dayBefore, reportDate, operDays])
    const handleDateChange = useCallback(id => date => {
        if (operDays.findIndex(d => formatOneDate(date) === d) >= 0 && formatOneDate(new Date()) !== formatOneDate(date)) {
            const {selectedDate} = formatDate(date, true)
            if (id === 'first_date') {
                if (new Date(selectedDate) < new Date(secondDate)) {
                    setFirstDate(selectedDate)
                } else {
                    toast.error('Первое дата должно быть меньше второго.')
                }
            } else {
                if (new Date(firstDate) < new Date(selectedDate)) {
                    setSecondDate(selectedDate)
                } else {
                    toast.error('Вторая дата должна быть больше первой.')
                }
            }
        }
    }, [firstDate, secondDate, operDays])
    const classes = useStyles()
    return (
        <Fragment>
            {<>
                <InputLabel htmlFor="dates_option">Выберите период</InputLabel>
                <br/>
                <FormControl className={classes.optionBlock}>
                    <Select
                        native
                        value={dateOption}
                        onChange={({target: {value}}) => setDateOption(value)}
                        inputProps={{
                            name: 'date_option',
                            id: 'dates_option',
                        }}
                        variant='outlined'
                        margin='dense'
                        disabled={loading}
                    >
                        <option value='two'>Всего два дня</option>
                        <option disabled value='all'>Два дня и информация между ними</option>
                        <option disabled value='month'>Данные за два дня и начало месяца между ними</option>
                    </Select>
                </FormControl>
                <FormHelperText>
                    Важно: Сбор данных для третьего варианта требует больше времени.
                    Пожалуйста, выберите его, если вам нужны именно эти данные.
                </FormHelperText>
            </>}
            <br/>
            {loading ?
                <Loader/> :
                error ? <Alert message={error}/>
                    :
                    <>
                        <DashboardMonthlyTable
                            operDays={operDays}
                            operDaysLoading={operDaysLoading}
                            firstDate={firstDate}
                            secondDate={secondDate}
                            handleDateChange={handleDateChange}
                            rows={dashboardMonthly}/>
                    </>}
        </Fragment>
    )
}

export default DashboardMonthly