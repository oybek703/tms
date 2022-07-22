import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import CapitalTable from '../../tables/CapitalTable'
import Loader from '../../UI/Layout/Loader'
import { useDispatch } from 'react-redux'
import { fetchCapital } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import useTypedSelector from '../../../hooks/useTypedSelector'

const Capital = () => {
    const dispatch = useDispatch()
    const {capital, loading, error} = useTypedSelector(state => state.capital)
    const {reportDate} = useTypedSelector(state => state.date)
    useEffect(() => {
        dispatch(fetchCapital(reportDate))
    }, [reportDate, dispatch])
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