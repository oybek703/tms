import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import ReportLiabilitiesTable from '../../components/tables/ReportLiabilitiesTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'

const ReportLiabilities = () => {
	const { fetchReportLiabilities } = useActions()
	const { reportLiabilities, loading, error } = useTypedSelector(state => state.reportLiabilities)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchReportLiabilities()
	}, [reportDate, fetchReportLiabilities])
	return (
		<>
			<PageTitle title="Отчет об обязательствах" />
			{loading ? <Loader /> : error ? <Alert message={error} /> : <ReportLiabilitiesTable rows={reportLiabilities} />}
		</>
	)
}

export default ReportLiabilities
