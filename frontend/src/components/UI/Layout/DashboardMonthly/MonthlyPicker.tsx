import 'date-fns'
import React, { memo, useCallback } from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { disableDays } from '../../../../utils'
import { WrapperVariant } from '@material-ui/pickers/wrappers/Wrapper'

interface MonthlyPickerProps {
    reportDate: string,
    disabled: boolean,
    operDays: any,
    variant?: WrapperVariant,
    handleDateChange: any
}

const MonthlyPicker: React.FC<MonthlyPickerProps> = ({
  reportDate,
  disabled = false,
  operDays = [],
  variant='inline',
  handleDateChange = () => {} }) => {
  const memoizedDisableWeekends = useCallback(
      (date) => disableDays(date, operDays),
      [operDays]
  )
  return (
    <MuiPickersUtilsProvider
      utils={DateFnsUtils} >
      <KeyboardDatePicker onChange={handleDateChange} onError={handleDateChange}
        disableToolbar
        shouldDisableDate={memoizedDisableWeekends}
        margin="dense"
        variant={variant}
        minDate={new Date('2020-01-01')}
        format="dd/MM/yyyy"
        disabled={disabled}
        value={reportDate}
        helperText=''
        invalidDateMessage='Please enter valid date!'
        maxDate={new Date(new Date() as any -86400000)}
        autoComplete='off'
      />
    </MuiPickersUtilsProvider>
  )
}

export default memo(MonthlyPicker)
