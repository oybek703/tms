import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import CapitalTable from '../../tables/CapitalTable'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'

const Capital = () => {
    const { fetchCapital } = useActions()
    const {capital, loading, error} = useTypedSelector(state => state.capital)
    const {reportDate} = useTypedSelector(state => state.date)
    useEffect(() => {
        fetchCapital(reportDate)
    }, [reportDate, fetchCapital])
    return (
        <>
            <PageTitle title='Расчет капитала банка'/>
            {loading
                ? <Loader/>
                : error
                    ? <Alert message={error}/>
                    : <CapitalTable rows={capital}/>}
        </>
    )
}

export default Capital
