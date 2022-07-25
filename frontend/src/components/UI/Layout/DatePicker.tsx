import 'date-fns'
import React from 'react'
import {Fragment, memo, useCallback} from 'react'
import DateFnsUtils from '@date-io/date-fns'
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers'
import {useDispatch} from "react-redux"
import {changeReportDate} from "../../../redux/actions"
import {disableDays, formatOneDate} from "../../../utils"
import ReloadBtn from './ReloadBtn'
import {useLocation} from 'react-router-dom'

interface DatePickerProps {
    reportDate: string
    operDays: string[]
    disabled: boolean
}

const DatePicker: React.FC<DatePickerProps> =  function({reportDate, operDays = [] , disabled = false}) {
    const dispatch = useDispatch()
    const {pathname} = useLocation()
    const handleDateChange = useCallback((date) =>  {
        if(operDays.findIndex(d => formatOneDate(date) === d) >= 0)
            dispatch(changeReportDate(date))
    }, [dispatch, operDays])
    const memoizedDisableWeekends = useCallback(
      (date) => disableDays(date, operDays),
        [operDays]
    )
    return (
        <Fragment>
            <MuiPickersUtilsProvider
                utils={DateFnsUtils} >
                <KeyboardDatePicker
                    showTodayButton
                    disabled={disabled}
                    shouldDisableDate={memoizedDisableWeekends}
                    margin="dense"
                    minDate={new Date('2020-01-01')}
                    id="date-picker-dialog"
                    format="dd/MM/yyyy"
                    value={reportDate}
                    onChange={handleDateChange}
                    inputVariant='outlined'
                    DialogProps={{transitionDuration: {appear: 300, enter: 300, exit: 300}}}
                    KeyboardButtonProps={{
                        'aria-label': 'change date'
                    }}
                    onError={handleDateChange}
                    invalidDateMessage='Please enter valid date!'
                    maxDate={new Date()}
                    autoComplete='off'
                />
            </MuiPickersUtilsProvider>
            {pathname === '/' && <Fragment>&nbsp;<ReloadBtn/></Fragment>}
        </Fragment>
    )
}

export default memo(DatePicker)
