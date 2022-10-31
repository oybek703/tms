import React, { useEffect } from 'react'
import PageTitle from '../../components/UI/Layout/PageTitle'
import Loader from '../../components/UI/Layout/Loader'
import Alert from '../../components/UI/Layout/Alert'
import ReportLiabilitiesTable from '../../components/tables/ReportLiabilitiesTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions1 from '../../hooks/useActions1'

const ReportLiabilities = () => {
	const { fetchReportLiabilities } = useActions1()
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
