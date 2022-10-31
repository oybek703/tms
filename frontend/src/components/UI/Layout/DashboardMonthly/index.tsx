import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { dateRegex, findRecursive } from '../../../../utils'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import { toast } from 'react-toastify'
import Alert from '../Alert'
import Loader from '../Loader'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import DashboardMonthlyTable from './DashboardMonthlyTable'
import { format } from 'date-fns'
import useActions from '../../../../hooks/useActions'

const DashboardMonthly: React.FC = () => {
	const { fetchDashboardMonthly } = useActions()
	const { reportDate } = useTypedSelector(state => state.operDays)
	const [dateOption, setDateOption] = useState('two')
	const { operDays } = useTypedSelector(state => state.operDays)
	const dayBefore = findRecursive(operDays, reportDate)
	const { dashboardMonthly, loading, error } = useTypedSelector(state => state.dashboardMonthly)
	const [firstDate, setFirstDate] = useState(dayBefore as string)
	const [secondDate, setSecondDate] = useState(dayBefore as string)
	useEffect(() => {
		if (firstDate && secondDate && firstDate !== secondDate) {
			fetchDashboardMonthly({ firstDate, secondDate, dateOption })
		}
	}, [fetchDashboardMonthly, firstDate, secondDate, dateOption])
	useEffect(() => {
		let newSecondDate = format(new Date(reportDate), 'yyyy-MM-dd')
		const isReportDateToday = newSecondDate === format(new Date(), 'yyyy-MM-dd')
		if (isReportDateToday) {
			newSecondDate = findRecursive(operDays, new Date(newSecondDate))
			if (newSecondDate) {
				const newFirstDate = findRecursive(operDays, new Date(newSecondDate))
				setSecondDate(newSecondDate)
				setFirstDate(newFirstDate)
			}
		} else {
			setFirstDate(dayBefore)
			setSecondDate(newSecondDate)
		}
		//   setDateOption('two')
	}, [dayBefore, reportDate, operDays])
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
			{
				<>
					<InputLabel htmlFor="dates_option">Выберите период</InputLabel>
					<FormControl>
						{/*
              //@ts-ignore */}
						<Select
							onChange={({ target: { value } }) => setDateOption(value)}
							native
							value={dateOption}
							inputProps={{
								name: 'date_option',
								id: 'dates_option',
								sx: {
									padding: '5px 10px'
								}
							}}
							variant="outlined"
							margin="dense"
							disabled={loading}
						>
							<option value="two">Всего два дня</option>
							<option disabled value="all">
								Два дня и информация между ними
							</option>
							<option disabled value="month">
								Данные за два дня и начало месяца между ними
							</option>
						</Select>
					</FormControl>
					<FormHelperText>
						Важно: Сбор данных для третьего варианта требует больше времени. Пожалуйста, выберите его, если вам нужны
						именно эти данные.
					</FormHelperText>
				</>
			}
			<br />
			{loading ? (
				<Loader />
			) : error ? (
				<Alert message={error} />
			) : (
				<>
					<DashboardMonthlyTable
						firstDate={firstDate}
						secondDate={secondDate}
						handleDateChange={handleDateChange}
						rows={dashboardMonthly}
					/>
				</>
			)}
		</Fragment>
	)
}

export default DashboardMonthly
