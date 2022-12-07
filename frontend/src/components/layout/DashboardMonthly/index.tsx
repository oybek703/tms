import React, { Fragment, useEffect, useState } from 'react'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Alert from '../Alert'
import Loader from '../Loader'
import useTypedSelector from '../../../hooks/useTypedSelector'
import DashboardMonthlyTable from './DashboardMonthlyTable'
import useActions from '../../../hooks/useActions'
import useTwoDates from '../../../hooks/useTwoDates'

const DashboardMonthly: React.FC = () => {
	const { fetchDashboardMonthly } = useActions()
	const [dateOption, setDateOption] = useState('two')
	const { dashboardMonthly, loading, error } = useTypedSelector(state => state.dashboardMonthly)
	const { firstDate, secondDate, handleDateChange } = useTwoDates()
	useEffect(() => {
		if (firstDate && secondDate && firstDate !== secondDate) {
			fetchDashboardMonthly({ firstDate, secondDate, dateOption })
		}
	}, [fetchDashboardMonthly, firstDate, secondDate, dateOption])
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
