import React, { useEffect } from 'react'
import PageTitle from '../../components/UI/Layout/PageTitle'
import Loader from '../../components/UI/Layout/Loader'
import Alert from '../../components/UI/Layout/Alert'
import TopDepositsTable from '../../components/tables/TopDepositsTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions1 from '../../hooks/useActions1'

const TopDeposits = () => {
	const { fetchTopDeposits } = useActions1()
	const { topDeposits, loading, error } = useTypedSelector(state => state.topDeposits)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchTopDeposits()
	}, [reportDate, fetchTopDeposits])
	return (
		<>
			<PageTitle title="ОТЧЕТ ПО КОНЦЕНТРАЦИИ СРЕДСТВ КЛИЕНТОВ (ТОП-20)" />
			{loading ? <Loader /> : error ? <Alert message={error} /> : <TopDepositsTable rows={topDeposits} />}
		</>
	)
}

export default TopDeposits
