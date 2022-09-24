import React, { Fragment, useCallback, useEffect, useState } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'
import NostroMatrixTable from '../../tables/NostroMatrixTable'
import { findRecursive, formatDate, formatDateWithDash, formatOneDate } from '../../../utils'
import { toast } from 'react-toastify'
import InlineDatePicker from '../../UI/Layout/Pickers/InlineDatePicker'
import { Grid } from '@mui/material'

const NostroMatrix = () => {
  const { fetchNostroMatrix } = useActions()
  const { nostroMatrix, loading, error } = useTypedSelector(state => state.nostroMatrix)
  const { reportDate } = useTypedSelector(state => state.date)
  const { operDays } = useTypedSelector(state => state.operDays)
  const dayBefore = formatDateWithDash(findRecursive(operDays, reportDate)) as string
  const [firstDate, setFirstDate] = useState(dayBefore as string)
  const [secondDate, setSecondDate] = useState(dayBefore as string)
  useEffect(() => {
    let { selectedDate: newSecondDate } = formatDate(reportDate, true)
    const isReportDateToday = formatOneDate(reportDate) === formatOneDate(new Date().toString())
    if (isReportDateToday) {
      newSecondDate = formatDateWithDash(findRecursive(operDays, reportDate)) as string
      const newFirstDate = formatDateWithDash(findRecursive(operDays, new Date(newSecondDate))) as string
      setSecondDate(newSecondDate)
      setFirstDate(newFirstDate)
    } else {
      setFirstDate(dayBefore)
      setSecondDate(newSecondDate)
    }
  }, [dayBefore, reportDate, operDays])
  useEffect(() => {
    if (firstDate && secondDate && firstDate !== secondDate) {
      fetchNostroMatrix(new Date(firstDate).toString(), new Date(secondDate).toString())
    }
  }, [fetchNostroMatrix, firstDate, secondDate, reportDate])
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
  return (
    <Fragment>
      <PageTitle title='Матрица валютных корр. счетов банка'/>
      <fieldset>
        <legend>Выберите период</legend>
        <Grid container alignItems='center'>
          <InlineDatePicker disabled={loading}
            reportDate={firstDate} inputVariant='outlined'
            handleDateChange={handleDateChange('first_date')}
          /> &nbsp;&nbsp;
          <InlineDatePicker disabled={loading}
            reportDate={secondDate} inputVariant='outlined'
            handleDateChange={handleDateChange('second_date')}
          />
        </Grid>
      </fieldset>
      <br/>
      {loading ?
        <Loader/> :
        error ? <Alert message={error}/> :
          <NostroMatrixTable noData={Boolean(!firstDate && !secondDate)} rows={nostroMatrix}/>}
    </Fragment>
  )
}

export default NostroMatrix
