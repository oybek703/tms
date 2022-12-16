import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import CAAManualTable from '../../components/tables/CAAManualTable'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const CAAManual = () => {
	const { fetchCaaManual } = useActions()
	const { manualLoading, manualError } = useTypedSelector(state => state.corrAccountsAnalyze)
	useEffect(() => {
		fetchCaaManual()
	}, [fetchCaaManual])
	return (
		<>
			<PageTitle title="Анализ корр.счетов(матрица) - изм." />
			<LoaderWrapper loading={manualLoading} error={manualError}>
				<CAAManualTable />
			</LoaderWrapper>
		</>
	)
}

export default CAAManual
