import 'date-fns'
import React, {memo, useCallback} from 'react'
import DateFnsUtils from '@date-io/date-fns'
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers'
import {disableDays} from "../../../../utils"

function MonthlyPicker({
                           reportDate,
                           disabled = false,
                           operDays = [],
                           variant='inline',
                           handleDateChange= () => {}}) {
    const memoizedDisableWeekends = useCallback(
      (date) => disableDays(date, operDays),
        [operDays]
    )
    return (
        <MuiPickersUtilsProvider
            utils={DateFnsUtils} >
                <KeyboardDatePicker
                    disableToolbar
                    shouldDisableDate={memoizedDisableWeekends}
                    margin="dense"
                    variant={variant}
                    minDate={new Date('2020-01-01')}
                    format="dd/MM/yyyy"
                    disabled={disabled}
                    value={reportDate}
                    helperText=''
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date'
                    }}
                    onError={handleDateChange}
                    invalidDateMessage='Please enter valid date!'
                    maxDate={new Date(new Date()-86400000)}
                    autoComplete='off'
                />
        </MuiPickersUtilsProvider>
    )
}

export default memo(MonthlyPicker)