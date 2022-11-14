import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import TopDepositsTable from '../../components/tables/TopDepositsTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'

const TopDeposits = () => {
	const { fetchTopDeposits } = useActions()
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
