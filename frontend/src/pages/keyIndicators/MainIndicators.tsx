import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import MainIndicatorsTable from '../../components/tables/MainIndicatorsTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const MainIndicators = () => {
	const { fetchMainIndicators } = useActions()
	const { loading, error } = useTypedSelector(state => state.mainIndicators)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchMainIndicators()
	}, [fetchMainIndicators, reportDate])
	return (
		<>
			<PageTitle title="Основные показатели банка" />
			<LoaderWrapper loading={loading} error={error}>
				<MainIndicatorsTable />
			</LoaderWrapper>
		</>
	)
}

export default MainIndicators
