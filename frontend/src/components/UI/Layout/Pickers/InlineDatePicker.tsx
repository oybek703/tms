import 'date-fns'
import React, { memo, useCallback } from 'react'
import { disableDays } from '../../../../utils'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { ru } from 'date-fns/locale'
import { format } from 'date-fns'

interface InlineDatePickerProps {
	reportDate: string
	handleDateChange: any
	disabled?: boolean
	inputVariant?: TextFieldProps['variant']
}

const InlineDatePicker: React.FC<InlineDatePickerProps> = ({
	reportDate,
	disabled = false,
	handleDateChange = () => {}
}) => {
	const { operDays, loading } = useTypedSelector(state => state.operDays)
	const memoizedDisableWeekends = useCallback(
		(date: string) => {
			const formattedDate = format(new Date(date), 'yyyy-MM-dd')
			return disableDays(formattedDate, operDays)
		},
		[operDays]
	)
	return (
		<LocalizationProvider adapterLocale={ru} dateAdapter={AdapterDateFns}>
			<DesktopDatePicker
				value={reportDate}
				disabled={disabled || loading}
				closeOnSelect
				disableHighlightToday
				inputFormat="dd.MM.yyyy"
				disableFuture
				shouldDisableDate={memoizedDisableWeekends}
				minDate={'2020-01-01'}
				onChange={handleDateChange}
				maxDate={new Date((new Date() as any) - 86400000).toString()}
				renderInput={params => (
					<TextField autoComplete="off" sx={{ '.MuiInputBase-input': { padding: '8px 14px' } }} {...params} />
				)}
			/>
		</LocalizationProvider>
	)
}

export default memo(InlineDatePicker)
