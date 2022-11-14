import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import ProfitAndLostTable from '../../components/tables/ProfitAndLostTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'

const ProfitAndLost = () => {
	const { fetchProfitAndLost } = useActions()
	const { profitAndLost, loading, error } = useTypedSelector(state => state.profitAndLost)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchProfitAndLost()
	}, [fetchProfitAndLost, reportDate])
	return (
		<>
			<PageTitle title="Отчет о прибылях и убытках банка" />
			{loading ? (
				<Loader />
			) : error ? (
				<Alert message={error} />
			) : (
				<ProfitAndLostTable pickedDate={reportDate} rows={profitAndLost} />
			)}
		</>
	)
}

export default ProfitAndLost
