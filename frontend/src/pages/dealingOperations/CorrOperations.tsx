import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import useTwoDates from '../../hooks/useTwoDates'
import { Grid, Paper } from '@mui/material'
import InlineDatePicker from '../../components/layout/Pickers/InlineDatePicker'

const CorrOperations = () => {
	const { fetchCorrOperations } = useActions()
	const { corrOperations, loading, error } = useTypedSelector(state => state.corrOperations)
	const { firstDate, secondDate, handleDateChange } = useTwoDates()
	useEffect(() => {
		if (firstDate && secondDate && firstDate !== secondDate) {
			fetchCorrOperations({ firstDate, secondDate })
		}
	}, [fetchCorrOperations, secondDate, firstDate])
	console.log(corrOperations)
	return (
		<>
			<PageTitle title="Дешбоард по корр. операциям" />
			{loading ? (
				<Loader />
			) : error ? (
				<Alert message={error} />
			) : (
				<Paper sx={{ padding: 2 }}>
					<Grid container justifyContent="flex-end" alignItems="center">
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
						<span>млн.</span>
						&nbsp;&nbsp;
					</Grid>
				</Paper>
			)}
		</>
	)
}

export default CorrOperations
