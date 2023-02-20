import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'
import IncomeAnalysisTable from '../../components/tables/IncomeAnalysisTable'

const IncomeAnalysis = () => {
	const { fetchIncomeAnalysis } = useActions()
	const { loading, error } = useTypedSelector(state => state.incomeAnalysis)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchIncomeAnalysis()
	}, [reportDate, fetchIncomeAnalysis])
	return (
		<>
			<PageTitle title="Анализ дохода и расхода" />
			<LoaderWrapper loading={loading} error={error}>
				<IncomeAnalysisTable />
			</LoaderWrapper>
		</>
	)
}

export default IncomeAnalysis
