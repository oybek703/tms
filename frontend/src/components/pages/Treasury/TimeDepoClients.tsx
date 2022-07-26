import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import TimeDepoClientsTable from '../../tables/TimeDepoClientsTable'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'

const TimeDepoClients = () => {
  const { fetchTimeDepoClients } = useActions()
  const { timeDepoClients, loading, error } = useTypedSelector(
      (state) => state.timeDepoClients)
  const { reportDate } = useTypedSelector((state) => state.date)
  useEffect(() => {
    fetchTimeDepoClients(reportDate)
  }, [fetchTimeDepoClients, reportDate])
  return (
    <>
      <PageTitle
        title='Информация о привлеченных средствах юридических лиц в  срочные депозиты  банка'/>
      {loading ?
            <Loader/> :
            error ? <Alert message={error}/> :
              <TimeDepoClientsTable rows={timeDepoClients}/>}
    </>
  )
}

export default TimeDepoClients
