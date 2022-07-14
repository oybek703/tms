import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import CalcForTable from '../../tables/CalcForTable'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCalcFor } from '../../../redux/actions'

const CalcFor = ({forDashboard = false}) => {
    const dispatch = useDispatch()
    const {calcfor = [], loading, error} = useSelector(state => state.calcFor)
    const {reportDate} = useSelector(state => state.date)
    const {DATE_VALUE: startDate} = [...calcfor].shift() || {}
    const {DATE_VALUE: endDate} = [...calcfor].pop() || {}
    useEffect(() => {
        dispatch(fetchCalcFor(reportDate))
    }, [reportDate, dispatch])
    useEffect(() => {window.scrollTo({left: 0, top: 0, behavior: 'smooth'})}, [])
    return (
        <>
            {!forDashboard && <PageTitle title={`РАСЧЕТ ФОР ${(loading || !(startDate && endDate)) 
                ? '' 
                : `C ${startDate} - ${endDate}`}`}/>
            }
            {loading
                ? <Loader/>
                : error
                    ? <Alert message={error}/>
                    : <CalcForTable forDashboard={forDashboard} rows={calcfor}/>}
        </>
    )
}

export default CalcFor