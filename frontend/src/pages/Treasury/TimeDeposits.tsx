import React, { useEffect } from 'react'
import PageTitle from '../../components/UI/Layout/PageTitle'
import Loader from '../../components/UI/Layout/Loader'
import Alert from '../../components/UI/Layout/Alert'
import TimeDepositsTable from '../../components/tables/TimeDepositsTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions1 from '../../hooks/useActions1'

const TimeDeposits = () => {
	const { fetchTimeDeposits } = useActions1()
	const { timeDeposits, loading, error } = useTypedSelector(state => state.timeDeposits)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchTimeDeposits()
	}, [reportDate, fetchTimeDeposits])
	return (
		<>
			<PageTitle title="Информация о срочных депозитах юридических лиц банка" />
			{loading ? (
				<Loader />
			) : error ? (
				<Alert message={error} />
			) : (
				<TimeDepositsTable rows={timeDeposits} pickedDate={reportDate} />
			)}
		</>
	)
}

export default TimeDeposits
