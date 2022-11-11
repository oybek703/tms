import React, { useEffect } from 'react'
import PageTitle from '../../components/UI/Layout/PageTitle'
import Loader from '../../components/UI/Layout/Loader'
import Alert from '../../components/UI/Layout/Alert'
import TimeDepoClientsTable from '../../components/tables/TimeDepoClientsTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'

const TimeDepoClients = () => {
	const { fetchTimeDepoClients } = useActions()
	const { timeDepoClients, loading, error } = useTypedSelector(state => state.timeDepoClients)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchTimeDepoClients()
	}, [fetchTimeDepoClients, reportDate])
	return (
		<>
			<PageTitle title="Информация о привлеченных средствах юридических лиц в  срочные депозиты  банка" />
			{loading ? <Loader /> : error ? <Alert message={error} /> : <TimeDepoClientsTable rows={timeDepoClients} />}
		</>
	)
}

export default TimeDepoClients
