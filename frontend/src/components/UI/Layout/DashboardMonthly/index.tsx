import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { findRecursive, formatDate, formatDateWithDash, formatOneDate } from '../../../../utils'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import { toast } from 'react-toastify'
import Alert from '../Alert'
import { fetchDashboardMonthly } from '../../../../redux/actions'
import Loader from '../Loader'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import DashboardMonthlyTable from './DashboardMonthlyTable'

const useStyles = makeStyles(theme => ({
    optionBlock: {
        maxWidth: 600
    }
}))

const DashboardMonthly: React.FC = () => {
    const dispatch = useDispatch()
    const { reportDate } = useTypedSelector(state => state.date)
    const [dateOption, setDateOption] = useState('two')
    const { operDays, loading: operDaysLoading } = useTypedSelector(
        state => state.operDays)
    const dayBefore = formatDateWithDash(findRecursive(operDays, reportDate)) as string
    const { dashboardMonthly, loading, error } = useTypedSelector(
        state => state.dashboardMonthly)
    const [firstDate, setFirstDate] = useState(dayBefore as string)
    const [secondDate, setSecondDate] = useState(dayBefore as string)
    useEffect(() => {
        if (firstDate && secondDate && firstDate !== secondDate) {
            dispatch(fetchDashboardMonthly(new Date(firstDate).toString(),
                new Date(secondDate).toString(), dateOption))
        }
    }, [dispatch, firstDate, secondDate, dateOption])
    useEffect(() => {
        let { selectedDate: newSecondDate } = formatDate(reportDate, true)
        const isReportDateToday = formatOneDate(reportDate) ===
            formatOneDate(new Date().toString())
        if (isReportDateToday) {
            newSecondDate = formatDateWithDash(
                findRecursive(operDays, reportDate)) as string
            const newFirstDate = formatDateWithDash(findRecursive(operDays, new Date(newSecondDate))) as string
            setSecondDate(newSecondDate)
            setFirstDate(newFirstDate)
        } else {
            setFirstDate(dayBefore)
            setSecondDate(newSecondDate)
        }
        setDateOption('two')
    }, [dayBefore, reportDate, operDays])
    const handleDateChange = useCallback(id => (date: string) => {
        if (operDays.findIndex((d: string) => formatOneDate(date) === d) >= 0 &&
            formatOneDate(new Date().toString()) !== formatOneDate(date)) {
            const { selectedDate } = formatDate(date, true)
            if (id === 'first_date') {
                if (new Date(selectedDate) < new Date(String(secondDate))) {
                    setFirstDate(selectedDate)
                } else {
                    toast.error('Первое дата должно быть меньше второго.')
                }
            } else {
                if (new Date(String(firstDate)) < new Date(selectedDate)) {
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
                    {/*
                    //@ts-ignore*/}
                    <Select onChange={({ target: { value } }) => setDateOption(value)}
                            native
                            value={dateOption}
                            inputProps={{
                                name: 'date_option',
                                id: 'dates_option'
                            }}
                            variant='outlined'
                            margin='dense'
                            disabled={loading}
                    >
                        <option value='two'>Всего два дня</option>
                        <option disabled value='all'>Два дня и информация между
                            ними
                        </option>
                        <option disabled value='month'>Данные за два дня и
                            начало месяца между ними
                        </option>
                    </Select>
                </FormControl>
                <FormHelperText>
                    Важно: Сбор данных для третьего варианта требует больше
                    времени.
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