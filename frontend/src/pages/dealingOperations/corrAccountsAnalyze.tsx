import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import CorrAccountsAnalyzeTable from '../../components/tables/CorrAccountsAnalyzeTable'

const CorrAccountsAnalyze = () => {
	const { fetchCorrAccountsAnalyze } = useActions()
	const { corrAccountsAnalyze, loading, error } = useTypedSelector(state => state.corrAccountsAnalyze)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchCorrAccountsAnalyze()
	}, [fetchCorrAccountsAnalyze, reportDate])
	return (
		<>
			<PageTitle title="Анализ корр.счетов(матрица)" />
			{loading ? (
				<Loader />
			) : error ? (
				<Alert message={error} />
			) : (
				<CorrAccountsAnalyzeTable rows={corrAccountsAnalyze} />
			)}
		</>
	)
}

export default CorrAccountsAnalyze
