import React, { Fragment, memo, useEffect } from 'react'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import PageTitle from '../../components/layout/PageTitle'
import CompetitiveAnalysisTable from '../../components/tables/CompetitiveAnalysisTable'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const CompetitiveAnalysis = () => {
	const { fetchCompetitiveAnalysis } = useActions()
	const { reportDate } = useTypedSelector(state => state.operDays)
	const { loading, error } = useTypedSelector(state => state.competitiveAnalysis)
	useEffect(() => {
		fetchCompetitiveAnalysis()
	}, [fetchCompetitiveAnalysis, reportDate])
	return (
		<Fragment>
			<PageTitle title="Конкурентный анализ" />
			<LoaderWrapper loading={loading} error={error}>
				<CompetitiveAnalysisTable />
			</LoaderWrapper>
		</Fragment>
	)
}

export default memo(CompetitiveAnalysis)
