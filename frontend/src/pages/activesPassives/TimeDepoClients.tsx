import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import TimeDepoClientsTable from '../../components/tables/TimeDepoClientsTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const TimeDepoClients = () => {
	const { fetchTimeDepoClients } = useActions()
	const { loading, error } = useTypedSelector(state => state.timeDepoClients)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchTimeDepoClients()
	}, [fetchTimeDepoClients, reportDate])
	return (
		<>
			<PageTitle title="Информация о привлеченных средствах юридических лиц в  срочные депозиты  банка" />
			<LoaderWrapper loading={loading} error={error}>
				<TimeDepoClientsTable />
			</LoaderWrapper>
		</>
	)
}

export default TimeDepoClients
