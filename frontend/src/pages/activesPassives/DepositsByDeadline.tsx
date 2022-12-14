import React, { Fragment, useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import DepositsByDeadlineTable from '../../components/tables/DepositsByDeadlineTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const DepositsByDeadline = () => {
	const { fetchDepositsByDeadline } = useActions()
	const { loading, error } = useTypedSelector(state => state.depositsByDeadline)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchDepositsByDeadline()
	}, [fetchDepositsByDeadline, reportDate])
	return (
		<Fragment>
			<PageTitle title="Депозиты юридических лиц. по срокам возврата" />
			<LoaderWrapper loading={loading} error={error}>
				<DepositsByDeadlineTable />
			</LoaderWrapper>
		</Fragment>
	)
}

export default DepositsByDeadline
