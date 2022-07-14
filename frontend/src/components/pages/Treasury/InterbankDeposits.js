import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInterbankDeposits } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import InterbankDepositsTable from '../../tables/InterbankDepositsTable'

const InterBankDeposits = () => {
    const dispatch = useDispatch()
    const { interbankdeposits, loading, error } = useSelector(
      state => state.interbankdeposits)
    const { reportDate } = useSelector(state => state.date)
    useEffect(() => {
        dispatch(fetchInterbankDeposits(reportDate))
    }, [dispatch, reportDate])
    return (
      <>
          <PageTitle title='Информация о межбанковских депозитах банка'
                     disabled={loading}/>
          {loading ?
            <Loader/> :
            error ? <Alert message={error}/>
              :
              <InterbankDepositsTable rows={interbankdeposits}/>}
      </>
    )
}

export default InterBankDeposits