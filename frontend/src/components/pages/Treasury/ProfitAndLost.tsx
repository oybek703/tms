import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch } from 'react-redux'
import { fetchProfitAndLost } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import ProfitAndLostTable from '../../tables/ProfitAndLostTable'
import useTypedSelector from '../../../hooks/useTypedSelector'

const ProfitAndLost = () => {
    const dispatch = useDispatch()
    const { profitandlost, loading, error } = useTypedSelector(
        state => state.profitAndLost)
    const { reportDate } = useTypedSelector(state => state.date)
    useEffect(() => {
        dispatch(fetchProfitAndLost(reportDate))
    }, [dispatch, reportDate])
    return (
        <>
            <PageTitle title='Отчет о прибылях и убытках банка'/>
            {loading ?
                <Loader/> :
                error ? <Alert message={error}/>
                    :
                    <ProfitAndLostTable pickedDate={reportDate}
                                        rows={profitandlost}/>}
        </>
    )
}

export default ProfitAndLost