import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import CAAManualTable from '../../components/tables/CAAManualTable'

const CAAManual = () => {
	const { fetchCorrAccountsAnalyze } = useActions()
	const { corrAccountsAnalyze, loading, error } = useTypedSelector(state => state.corrAccountsAnalyze)
	useEffect(() => {
		fetchCorrAccountsAnalyze()
	}, [fetchCorrAccountsAnalyze])
	return (
		<>
			<PageTitle title="Анализ корр.счетов(матрица)" />
			{loading ? <Loader /> : error ? <Alert message={error} /> : <CAAManualTable rows={corrAccountsAnalyze} />}
		</>
	)
}

export default CAAManual
