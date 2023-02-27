import React, { useEffect, useState } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import useTypedSelector from '../../hooks/useTypedSelector'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'
import FilialCPTable from '../../components/tables/FilialCpTable'
import InlineDatePicker from '../../components/layout/Pickers/InlineDatePicker'
import { FormControl, Grid, MenuItem, Paper, Select } from '@mui/material'
import useActions from '../../hooks/useActions'
import useTwoDates from '../../hooks/useTwoDates'

const FilialCp = () => {
	const { fetchFilialCp } = useActions()
	const [currencyCode, setCurrencyCode] = useState<string>('840')
	const { firstDate, secondDate, handleDateChange } = useTwoDates()
	const { loading, error } = useTypedSelector(state => state.filialCp)
	useEffect(() => {
		if (firstDate && secondDate && firstDate !== secondDate) {
			fetchFilialCp({ firstDate, secondDate, currencyCode })
		}
	}, [fetchFilialCp, firstDate, secondDate, currencyCode])
	return (
		<>
			<PageTitle title="Валютная позиция филиалов" />
			<Paper>
				<Grid sx={{ pt: 2, pb: 1, my: 1, pr: 1 }} container justifyContent="flex-end" alignItems="center">
					<InlineDatePicker
						disabled={loading}
						reportDate={firstDate}
						inputVariant="outlined"
						handleDateChange={handleDateChange('first_date')}
					/>
					&nbsp;&nbsp;
					<InlineDatePicker
						disabled={loading}
						reportDate={secondDate}
						inputVariant="outlined"
						handleDateChange={handleDateChange('second_date')}
					/>
					&nbsp;&nbsp;
					{/* <span>млн.</span> */}
					&nbsp;&nbsp;
					<FormControl size="small">
						<Select
							disabled={loading}
							labelId="currency"
							id="currency"
							value={currencyCode}
							onChange={({ target: { value } }) => setCurrencyCode(value)}
						>
							<MenuItem value="840">USD</MenuItem>
							<MenuItem value="978">EUR</MenuItem>
							<MenuItem value="643">RUB</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<LoaderWrapper loading={loading} error={error}>
					<FilialCPTable />
				</LoaderWrapper>
			</Paper>
		</>
	)
}

export default FilialCp
43333
