import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTimeDeposits } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import TimeDepositsTable from '../../tables/TimeDepositsTable'

const TimeDeposits = () => {
    const dispatch = useDispatch()
    const { timeDeposits, loading, error } = useSelector(
      state => state.timeDeposits)
    const { reportDate } = useSelector(state => state.date)
    useEffect(() => {
        dispatch(fetchTimeDeposits(reportDate))
    }, [reportDate, dispatch])
    return (
      <>
          <PageTitle
            title='Информация о срочных депозитах юридических лиц банка'
            disabled={loading}/>
          {loading
            ? <Loader/>
            : error
              ? <Alert message={error}/>
              : <TimeDepositsTable rows={timeDeposits}
                                   pickedDate={reportDate}/>}
      </>
    )
}

export default TimeDeposits