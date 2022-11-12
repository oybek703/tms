import React, { Fragment, useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import DepositsByDeadlineTable from '../../components/tables/DepositsByDeadlineTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'

const DepositsByDeadline = () => {
	const { fetchDepositsByDeadline } = useActions()
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
