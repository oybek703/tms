import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch } from 'react-redux'
import { fetchInterbankDeposits } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import InterbankDepositsTable from '../../tables/InterbankDepositsTable'
import useTypedSelector from '../../../hooks/useTypedSelector'

const InterBankDeposits = () => {
    const dispatch = useDispatch()
    const { interbankdeposits, loading, error } = useTypedSelector(
      state => state.interbankdeposits)
    const { reportDate } = useTypedSelector(state => state.date)
    useEffect(() => {
        dispatch(fetchInterbankDeposits(reportDate))
    }, [dispatch, reportDate])
    return (
      <>
          <PageTitle title='Информация о межбанковских депозитах банка'/>
          {loading ?
            <Loader/> :
            error ? <Alert message={error}/>
              :
              <InterbankDepositsTable rows={interbankdeposits}/>}
      </>
    )
}

export default InterBankDeposits