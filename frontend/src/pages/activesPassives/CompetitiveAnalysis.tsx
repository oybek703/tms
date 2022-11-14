import React, { Fragment, memo, useEffect } from 'react'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import PageTitle from '../../components/layout/PageTitle'
import CompetitiveAnalysisTable from '../../components/tables/CompetitiveAnalysisTable'

const CompetitiveAnalysis = () => {
	const { fetchCompetitiveAnalysis } = useActions()
	const { reportDate } = useTypedSelector(state => state.operDays)
	const { competitiveAnalysis, loading, error } = useTypedSelector(state => state.competitiveAnalysis)
	useEffect(() => {
		fetchCompetitiveAnalysis()
	}, [fetchCompetitiveAnalysis, reportDate])
	return (
		<Fragment>
			<PageTitle title="Конкурентный анализ" />
			{loading ? (
				<Loader />
			) : error ? (
				<Alert message={error} />
			) : (
				<CompetitiveAnalysisTable rows={competitiveAnalysis} />
			)}
		</Fragment>
	)
}

export default memo(CompetitiveAnalysis)
