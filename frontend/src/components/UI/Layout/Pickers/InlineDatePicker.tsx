import 'date-fns'
import React, { memo, useCallback } from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { disableDays } from '../../../../utils'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import { TextFieldProps } from '@material-ui/core/TextField'

interface InlineDatePickerProps {
    reportDate: string,
    handleDateChange: any
    disabled?: boolean,
    inputVariant?: TextFieldProps['variant']
}

const InlineDatePicker: React.FC<InlineDatePickerProps> = ({
  reportDate, disabled = false, inputVariant,
  handleDateChange = () => {} }) => {
  const { operDays, loading } = useTypedSelector(state => state.operDays)
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
        variant='inline'
        minDate={new Date('2020-01-01')}
        format="dd/MM/yyyy"
        disabled={loading || disabled}
        value={reportDate}
        autoOk={true}
        helperText=''
        invalidDateMessage='Please enter valid date!'
        maxDate={new Date(new Date() as any - 86400000)}
        autoComplete='off'
        inputVariant={inputVariant}
      />
    </MuiPickersUtilsProvider>
  )
}

export default memo(InlineDatePicker)
