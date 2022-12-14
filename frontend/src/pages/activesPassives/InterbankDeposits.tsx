import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import InterbankDepositsTable from '../../components/tables/InterbankDepositsTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const InterBankDeposits = () => {
	const { fetchInterbankDeposits } = useActions()
	const { loading, error } = useTypedSelector(state => state.interbankDeposits)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchInterbankDeposits()
	}, [fetchInterbankDeposits, reportDate])
	return (
		<>
			<PageTitle title="Информация о межбанковских депозитах банка" />
			<LoaderWrapper loading={loading} error={error}>
				<InterbankDepositsTable />
			</LoaderWrapper>
		</>
	)
}

export default InterBankDeposits
