import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import CAAManualTable from '../../components/tables/CAAManualTable'

const CAAManual = () => {
	const { fetchCaaManual } = useActions()
	const { caaManual, manualLoading, manualError } = useTypedSelector(state => state.corrAccountsAnalyze)
	useEffect(() => {
		fetchCaaManual()
	}, [fetchCaaManual])
	return (
		<>
			<PageTitle title="Анализ корр.счетов(матрица) - изм." />
			{manualLoading ? <Loader /> : manualError ? <Alert message={manualError} /> : <CAAManualTable rows={caaManual} />}
		</>
	)
}

export default CAAManual
