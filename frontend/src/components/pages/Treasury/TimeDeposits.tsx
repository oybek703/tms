import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import TimeDepositsTable from '../../tables/TimeDepositsTable'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'

const TimeDeposits = () => {
  const { fetchTimeDeposits } = useActions()
  const { timeDeposits, loading, error } = useTypedSelector(
      (state) => state.timeDeposits)
  const { reportDate } = useTypedSelector((state) => state.date)
  useEffect(() => {
    fetchTimeDeposits(reportDate)
  }, [reportDate, fetchTimeDeposits])
  return (
    <>
      <PageTitle
        title='Информация о срочных депозитах юридических лиц банка'/>
      {loading ?
            <Loader/> :
            error ?
              <Alert message={error}/> :
              <TimeDepositsTable rows={timeDeposits}
                pickedDate={reportDate}/>}
    </>
  )
}

export default TimeDeposits
