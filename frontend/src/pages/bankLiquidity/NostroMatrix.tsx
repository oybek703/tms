import React, { Fragment, useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import useTypedSelector from '../../hooks/useTypedSelector'
import NostroMatrixTable from '../../components/tables/NostroMatrixTable'
import InlineDatePicker from '../../components/layout/Pickers/InlineDatePicker'
import { Grid } from '@mui/material'
import useActions from '../../hooks/useActions'
import useTwoDates from '../../hooks/useTwoDates'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const NostroMatrix = () => {
	const { fetchNostroMatrix } = useActions()
	const { loading, error } = useTypedSelector(state => state.nostroMatrix)
	const { firstDate, secondDate, handleDateChange } = useTwoDates()
	useEffect(() => {
		if (firstDate && secondDate && firstDate !== secondDate) {
			fetchNostroMatrix({ firstDate, secondDate })
		}
	}, [fetchNostroMatrix, secondDate, firstDate])
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
			<LoaderWrapper loading={loading} error={error}>
				<NostroMatrixTable noData={Boolean(!firstDate && !secondDate)} />
			</LoaderWrapper>
		</Fragment>
	)
}

export default NostroMatrix
