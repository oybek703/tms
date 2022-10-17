import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import InterbankDepositsTable from '../../tables/InterbankDepositsTable'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'

const InterBankDeposits = () => {
	const { fetchInterbankDeposits } = useActions()
	const { interbankdeposits, loading, error } = useTypedSelector(state => state.interbankdeposits)
	const { reportDate } = useTypedSelector(state => state.date)
	useEffect(() => {
		fetchInterbankDeposits(reportDate)
	}, [fetchInterbankDeposits, reportDate])
	return (
		<>
			<PageTitle title="Информация о межбанковских депозитах банка" />
			{loading ? <Loader /> : error ? <Alert message={error} /> : <InterbankDepositsTable rows={interbankdeposits} />}
		</>
	)
}

export default InterBankDeposits
