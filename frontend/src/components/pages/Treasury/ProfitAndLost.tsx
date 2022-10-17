import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import ProfitAndLostTable from '../../tables/ProfitAndLostTable'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'

const ProfitAndLost = () => {
	const { fetchProfitAndLost } = useActions()
	const { profitandlost, loading, error } = useTypedSelector(state => state.profitAndLost)
	const { reportDate } = useTypedSelector(state => state.date)
	useEffect(() => {
		fetchProfitAndLost(reportDate)
	}, [fetchProfitAndLost, reportDate])
	return (
		<>
			<PageTitle title="Отчет о прибылях и убытках банка" />
			{loading ? (
				<Loader />
			) : error ? (
				<Alert message={error} />
			) : (
				<ProfitAndLostTable pickedDate={reportDate} rows={profitandlost} />
			)}
		</>
	)
}

export default ProfitAndLost
