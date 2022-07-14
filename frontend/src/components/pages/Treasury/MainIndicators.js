import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import MainIndicatorsTable from '../../tables/MainIndicatorsTable'
import Loader from '../../UI/Layout/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMainIndicators } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'

const MainIndicators = () => {
    const dispatch = useDispatch()
    const { mainIndicators, loading, error } = useSelector(
      state => state.mainIndicators)
    const { reportDate } = useSelector(state => state.date)
    useEffect(() => {
        dispatch(fetchMainIndicators(reportDate))
    }, [dispatch, reportDate])
    return (
      <>
          <PageTitle title='Основные показатели банка' disabled={loading}/>
          {loading ?
            <Loader/> :
            error ? <Alert message={error}/>
              :
              <MainIndicatorsTable pickedDate={reportDate}
                                   rows={mainIndicators}/>}
      </>
    )
}

export default MainIndicators