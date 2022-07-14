import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReportLiabilities } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import ReportLiabilitiesTable from '../../tables/ReportLiabilitiesTable'

const ReportLiabilities = () => {
    const dispatch = useDispatch()
    const {
        reportliabilities,
        loading,
        error
    } = useSelector(state => state.reportLiabilities)
    const {reportDate} = useSelector(state => state.date)
    useEffect(() => {
        dispatch(fetchReportLiabilities(reportDate))
    }, [reportDate, dispatch])
    return (
        <>
            <PageTitle title='Отчет об обязательствах'/>
            {loading
                ? <Loader/>
                : error
                    ? <Alert message={error}/>
                    : <ReportLiabilitiesTable rows={reportliabilities}/>}
        </>
    )
}

export default ReportLiabilities