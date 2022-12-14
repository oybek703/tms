import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import ProfitAndLostTable from '../../components/tables/ProfitAndLostTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const ProfitAndLost = () => {
	const { fetchProfitAndLost } = useActions()
	const { loading, error } = useTypedSelector(state => state.profitAndLost)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchProfitAndLost()
	}, [fetchProfitAndLost, reportDate])
	return (
		<>
			<PageTitle title="Отчет о прибылях и убытках банка" />
			<LoaderWrapper loading={loading} error={error}>
				<ProfitAndLostTable />
			</LoaderWrapper>
		</>
	)
}

export default ProfitAndLost
