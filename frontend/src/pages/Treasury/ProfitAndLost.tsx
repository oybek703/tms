import React, { useEffect } from 'react'
import PageTitle from '../../components/UI/Layout/PageTitle'
import Loader from '../../components/UI/Layout/Loader'
import Alert from '../../components/UI/Layout/Alert'
import ProfitAndLostTable from '../../components/tables/ProfitAndLostTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions1 from '../../hooks/useActions1'

const ProfitAndLost = () => {
	const { fetchProfitAndLost } = useActions1()
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
