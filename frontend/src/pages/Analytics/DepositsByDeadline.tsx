import React, { Fragment, useEffect } from 'react'
import PageTitle from '../../components/UI/Layout/PageTitle'
import Loader from '../../components/UI/Layout/Loader'
import Alert from '../../components/UI/Layout/Alert'
import DepositsByDeadlineTable from '../../components/tables/DepositsByDeadlineTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions1 from '../../hooks/useActions1'

const DepositsByDeadline = () => {
	const { fetchDepositsByDeadline } = useActions1()
	const { depositsByDeadline, loading, error } = useTypedSelector(state => state.depositsByDeadline)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchDepositsByDeadline()
	}, [fetchDepositsByDeadline, reportDate])
	return (
		<Fragment>
			<PageTitle title="Депозиты юридических лиц. по срокам возврата" />
			{loading ? <Loader /> : error ? <Alert message={error} /> : <DepositsByDeadlineTable rows={depositsByDeadline} />}
		</Fragment>
	)
}

export default DepositsByDeadline
