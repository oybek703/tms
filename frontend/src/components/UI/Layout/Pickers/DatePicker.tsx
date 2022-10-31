import { format } from 'date-fns'
import React, { Fragment, memo, useCallback } from 'react'
import { dateRegex, disableDays } from '../../../../utils'
import { useLocation } from 'react-router-dom'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import TextField from '@mui/material/TextField'
import ReloadBtn from '../ReloadBtn'
import { ru } from 'date-fns/locale'
import useActions from '../../../../hooks/useActions'

interface DatePickerProps {
	reportDate: string
	operDays: string[]
	disabled: boolean
}

const DatePicker: React.FC<DatePickerProps> = function ({ reportDate, operDays = [], disabled = false }) {
	const { pathname } = useLocation()
	const { changeReportDate } = useActions()
	const handleDateChange = useCallback(
		(date: string | null) => {
			let formattedDate: string
			try {
				formattedDate = date ? format(new Date(date), 'dd.MM.yyyy') : ''
			} catch (e: any) {
				formattedDate = e.message
			}
			if (date && dateRegex.test(formattedDate)) {
				formattedDate = format(new Date(date), 'yyyy-MM-dd')
				if (operDays.findIndex(d => formattedDate === d) >= 0) {
					changeReportDate(formattedDate)
				}
			}
		},
		[changeReportDate, operDays]
	)
	const memoizedDisableWeekends = useCallback(
		(date: string) => {
			const formattedDate = format(new Date(date), 'yyyy-MM-dd')
			return disableDays(formattedDate, operDays)
		},
		[operDays]
	)
	return (
		<Fragment>
			<LocalizationProvider adapterLocale={ru} dateAdapter={AdapterDateFns}>
				<DesktopDatePicker
					value={reportDate}
					showToolbar
					inputFormat="dd.MM.yyyy"
					disabled={disabled}
					toolbarTitle="Выберите дату"
					closeOnSelect
					disableFuture
					shouldDisableDate={memoizedDisableWeekends}
					minDate={'2020-01-01'}
					onChange={handleDateChange}
					renderInput={params => (
						<TextField
							autoComplete="off"
							sx={{ '.MuiInputBase-input': { padding: '8px 14px' } }}
							inputProps={{
								readOnly: true
							}}
							{...params}
						/>
					)}
				/>
			</LocalizationProvider>
			{pathname === '/' && (
				<Fragment>
					&nbsp;&nbsp;&nbsp;
					<ReloadBtn />
				</Fragment>
			)}
		</Fragment>
	)
}

export default memo(DatePicker)
