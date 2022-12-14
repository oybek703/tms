import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import TopDepositsTable from '../../components/tables/TopDepositsTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const TopDeposits = () => {
	const { fetchTopDeposits } = useActions()
	const { loading, error } = useTypedSelector(state => state.topDeposits)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchTopDeposits()
	}, [reportDate, fetchTopDeposits])
	return (
		<>
			<PageTitle title="ОТЧЕТ ПО КОНЦЕНТРАЦИИ СРЕДСТВ КЛИЕНТОВ (ТОП-20)" />
			<LoaderWrapper loading={loading} error={error}>
				<TopDepositsTable />
			</LoaderWrapper>
		</>
	)
}

export default TopDeposits
