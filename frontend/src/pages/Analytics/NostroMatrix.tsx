import React, { Fragment, useCallback, useEffect, useState } from 'react'
import PageTitle from '../../components/UI/Layout/PageTitle'
import Loader from '../../components/UI/Layout/Loader'
import Alert from '../../components/UI/Layout/Alert'
import useTypedSelector from '../../hooks/useTypedSelector'
import NostroMatrixTable from '../../components/tables/NostroMatrixTable'
import { dateRegex, findRecursive } from '../../utils'
import { toast } from 'react-toastify'
import InlineDatePicker from '../../components/UI/Layout/Pickers/InlineDatePicker'
import { Grid } from '@mui/material'
import { format } from 'date-fns'
import useActions from '../../hooks/useActions'

const NostroMatrix = () => {
	const { fetchNostroMatrix } = useActions()
	const { nostroMatrix, loading, error } = useTypedSelector(state => state.nostroMatrix)
	const { reportDate } = useTypedSelector(state => state.operDays)
	const { operDays } = useTypedSelector(state => state.operDays)
	const [firstDate, setFirstDate] = useState(reportDate)
	const [secondDate, setSecondDate] = useState(reportDate)
	useEffect(() => {
		if (firstDate && secondDate && firstDate !== secondDate) {
			fetchNostroMatrix({ firstDate, secondDate })
		}
	}, [fetchNostroMatrix, secondDate, firstDate])
	useEffect(() => {
		const dayBefore = findRecursive(operDays, reportDate)
		let newSecondDate = format(new Date(reportDate), 'yyyy-MM-dd')
		const isReportDateToday = newSecondDate === format(new Date(), 'yyyy-MM-dd')
		if (isReportDateToday) {
			newSecondDate = findRecursive(operDays, new Date(newSecondDate))
			if (newSecondDate) {
				const newFirstDate = findRecursive(operDays, new Date(newSecondDate))
				setFirstDate(newFirstDate)
				setSecondDate(newSecondDate)
			}
		} else {
			setFirstDate(dayBefore)
			setSecondDate(newSecondDate)
		}
	}, [reportDate, operDays])

	const handleDateChange = useCallback(
		(id: string) => (date: string | null) => {
			let formattedDate: string
			try {
				formattedDate = date ? format(new Date(date), 'dd.MM.yyyy') : ''
			} catch (e: any) {
				formattedDate = e.message
			}
			if (date && dateRegex.test(formattedDate)) {
				formattedDate = format(new Date(date), 'yyyy-MM-dd')
				const formattedTodayDate = format(new Date(), 'yyyy-MM-dd')
				if (operDays.findIndex((d: string) => formattedDate === d) >= 0 && formattedTodayDate !== formattedDate) {
					if (id === 'first_date') {
						if (new Date(formattedDate) < new Date(String(secondDate))) {
							setFirstDate(formattedDate)
						} else {
							toast.error('Первое дата должно быть меньше второго.')
						}
					} else {
						if (new Date(String(firstDate)) < new Date(formattedDate)) {
							setSecondDate(formattedDate)
						} else {
							toast.error('Вторая дата должна быть больше первой.')
						}
					}
				}
			}
		},
		[firstDate, secondDate, operDays]
	)
	return (
		<Fragment>
			<PageTitle title="Матрица валютных корр. счетов банка" />
			<fieldset>
				<legend>Выберите период</legend>
				<Grid container alignItems="center">
					<InlineDatePicker
						disabled={loading}
						reportDate={firstDate}
						inputVariant="outlined"
						handleDateChange={handleDateChange('first_date')}
					/>{' '}
					&nbsp;&nbsp;
					<InlineDatePicker
						disabled={loading}
						reportDate={secondDate}
						inputVariant="outlined"
						handleDateChange={handleDateChange('second_date')}
					/>
				</Grid>
			</fieldset>
			<br />
			{loading ? (
				<Loader />
			) : error ? (
				<Alert message={error} />
			) : (
				<NostroMatrixTable noData={Boolean(!firstDate && !secondDate)} rows={nostroMatrix} />
			)}
		</Fragment>
	)
}

export default NostroMatrix
