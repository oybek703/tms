import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch } from 'react-redux'
import { fetchCurrencyPosition } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import useTypedSelector from '../../../hooks/useTypedSelector'
import CurrencyPositionTable from '../../tables/CurrencyPositionTable'

const CurrencyPosition = () => {
    const dispatch = useDispatch()
    const { currencyPosition, loading, error } = useTypedSelector(
      state => state.currencyPosition)
    const { reportDate } = useTypedSelector(state => state.date)
    useEffect(() => {
        dispatch(fetchCurrencyPosition(reportDate))
    }, [dispatch, reportDate])
    return (
      <>
          <PageTitle title='Сведения об открытых валютных позициях банка'/>
          {loading ?
            <Loader/> :
            error ? <Alert message={error}/>
              :
              <CurrencyPositionTable rows={currencyPosition}/>}
      </>
    )
}

export default CurrencyPosition