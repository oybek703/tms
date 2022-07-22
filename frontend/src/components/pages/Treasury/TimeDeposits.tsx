import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch } from 'react-redux'
import { fetchTimeDeposits } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import TimeDepositsTable from '../../tables/TimeDepositsTable'
import useTypedSelector from '../../../hooks/useTypedSelector'

const TimeDeposits = () => {
    const dispatch = useDispatch()
    const { timeDeposits, loading, error } = useTypedSelector(
      state => state.timeDeposits)
    const { reportDate } = useTypedSelector(state => state.date)
    useEffect(() => {
        dispatch(fetchTimeDeposits(reportDate))
    }, [reportDate, dispatch])
    return (
      <>
          <PageTitle
            title='Информация о срочных депозитах юридических лиц банка'/>
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