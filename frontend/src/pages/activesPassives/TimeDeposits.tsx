import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import TimeDepositsTable from '../../components/tables/TimeDepositsTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const TimeDeposits = () => {
	const { fetchTimeDeposits } = useActions()
	const { loading, error } = useTypedSelector(state => state.timeDeposits)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchTimeDeposits()
	}, [reportDate, fetchTimeDeposits])
	return (
		<>
			<PageTitle title="Информация о срочных депозитах юридических лиц банка" />
			<LoaderWrapper loading={loading} error={error}>
				<TimeDepositsTable />
			</LoaderWrapper>
		</>
	)
}

export default TimeDeposits
