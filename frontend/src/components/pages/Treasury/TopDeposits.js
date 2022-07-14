import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTopDeposits } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import TopDepositsTable from '../../tables/TopDepositsTable'

const TopDeposits = () => {
    const dispatch = useDispatch()
    const { topDeposits, loading, error } = useSelector(
      state => state.topDeposits)
    const { reportDate } = useSelector(state => state.date)
    useEffect(() => {
        dispatch(fetchTopDeposits(reportDate))
    }, [reportDate, dispatch])
    return (
      <>
          <PageTitle title='ОТЧЕТ ПО КОНЦЕНТРАЦИИ СРЕДСТВ КЛИЕНТОВ (ТОП-20)'
                     disabled={loading}/>
          {loading
            ? <Loader/>
            : error
              ? <Alert message={error}/>
              : <TopDepositsTable rows={topDeposits}/>}
      </>
    )
}

export default TopDeposits