import React, { useEffect } from 'react'
import PageTitle from '../../components/UI/Layout/PageTitle'
import Loader from '../../components/UI/Layout/Loader'
import Alert from '../../components/UI/Layout/Alert'
import InterbankDepositsTable from '../../components/tables/InterbankDepositsTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'

const InterBankDeposits = () => {
	const { fetchInterbankDeposits } = useActions()
	const { interbankDeposits, loading, error } = useTypedSelector(state => state.interbankDeposits)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchInterbankDeposits()
	}, [fetchInterbankDeposits, reportDate])
	return (
		<>
			<PageTitle title="Информация о межбанковских депозитах банка" />
			{loading ? <Loader /> : error ? <Alert message={error} /> : <InterbankDepositsTable rows={interbankDeposits} />}
		</>
	)
}

export default InterBankDeposits
