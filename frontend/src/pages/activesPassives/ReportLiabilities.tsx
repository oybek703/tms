import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import ReportLiabilitiesTable from '../../components/tables/ReportLiabilitiesTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const ReportLiabilities = () => {
	const { fetchReportLiabilities } = useActions()
	const { loading, error } = useTypedSelector(state => state.reportLiabilities)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchReportLiabilities()
	}, [reportDate, fetchReportLiabilities])
	return (
		<>
			<PageTitle title="Отчет об обязательствах" />
			<LoaderWrapper loading={loading} error={error}>
				<ReportLiabilitiesTable />
			</LoaderWrapper>
		</>
	)
}

export default ReportLiabilities
