import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch } from 'react-redux'
import { fetchTopDeposits } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import TopDepositsTable from '../../tables/TopDepositsTable'
import useTypedSelector from '../../../hooks/useTypedSelector'

const TopDeposits = () => {
    const dispatch = useDispatch()
    const { topDeposits, loading, error } = useTypedSelector(
      state => state.topDeposits)
    const { reportDate } = useTypedSelector(state => state.date)
    useEffect(() => {
        dispatch(fetchTopDeposits(reportDate))
    }, [reportDate, dispatch])
    return (
      <>
          <PageTitle title='ОТЧЕТ ПО КОНЦЕНТРАЦИИ СРЕДСТВ КЛИЕНТОВ (ТОП-20)'/>
          {loading
            ? <Loader/>
            : error
              ? <Alert message={error}/>
              : <TopDepositsTable rows={topDeposits}/>}
      </>
    )
}

export default TopDeposits