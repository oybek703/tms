import 'date-fns'
import React, { Fragment, memo, useCallback } from 'react'
import { disableDays, formatOneDate } from '../../../../utils'
import { useLocation } from 'react-router-dom'
import useActions from '../../../../hooks/useActions'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import TextField from '@mui/material/TextField'
import ReloadBtn from '../ReloadBtn'
import { ru } from 'date-fns/locale'

interface DatePickerProps {
    reportDate: string
    operDays: string[]
    disabled: boolean
}


const DatePicker: React.FC<DatePickerProps> = function({ reportDate, operDays = [], disabled = false }) {
  const { pathname } = useLocation()
  const { changeReportDate } = useActions()
  const handleDateChange = useCallback((date: string) => {
    if (operDays.findIndex(d => formatOneDate(date) === d) >= 0) {
      changeReportDate(date)
    }
  }, [changeReportDate, operDays])
  const memoizedDisableWeekends = useCallback(
      (date: string) => disableDays(date, operDays),
      [operDays]
  )
  return (
    <Fragment>
      <LocalizationProvider adapterLocale={ru} dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          value={reportDate}
          showToolbar
          disabled={disabled}
          toolbarTitle='Выберите дату'
          closeOnSelect
          disableFuture
          shouldDisableDate={memoizedDisableWeekends}
          minDate={new Date('01/01/2020').toString()}
          onChange={value => handleDateChange(value!.toString())}
          renderInput={
            params => <TextField
              placeholder='dd.mm.yyyy'
              sx={{ '.MuiInputBase-input': { padding: '8px 14px' } }}
              {...params} />}
        />
      </LocalizationProvider>
      {pathname === '/' && <Fragment>&nbsp;&nbsp;&nbsp;<ReloadBtn/></Fragment>}
    </Fragment>
  )
}

export default memo(DatePicker)
