import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import ReportLiabilitiesTable from '../../tables/ReportLiabilitiesTable'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'

const ReportLiabilities = () => {
	const { fetchReportLiabilities } = useActions()
	const { reportliabilities, loading, error } = useTypedSelector(state => state.reportLiabilities)
	const { reportDate } = useTypedSelector(state => state.date)
	useEffect(() => {
		fetchReportLiabilities(reportDate)
	}, [reportDate, fetchReportLiabilities])
	return (
		<>
			<PageTitle title="Отчет об обязательствах" />
			{loading ? <Loader /> : error ? <Alert message={error} /> : <ReportLiabilitiesTable rows={reportliabilities} />}
		</>
	)
}

export default ReportLiabilities
