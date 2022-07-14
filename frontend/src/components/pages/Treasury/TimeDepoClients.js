import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTimeDepoClients } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import TimeDepoClientsTable from '../../tables/TimeDepoClientsTable'

const TimeDepoClients = () => {
    const dispatch = useDispatch()
    const { timeDepoClients, loading, error } = useSelector(
      state => state.timeDepoClients)
    const { reportDate } = useSelector(state => state.date)
    useEffect(() => {
        dispatch(fetchTimeDepoClients(reportDate))
    }, [dispatch, reportDate])
    return (
      <>
          <PageTitle
            title='Информация о привлеченных средствах юридических лиц в  срочные депозиты  банка'
            disabled={loading}/>
          {loading ?
            <Loader/> :
            error ? <Alert message={error}/>
              :
              <TimeDepoClientsTable rows={timeDepoClients}/>}
      </>
    )
}

export default TimeDepoClients