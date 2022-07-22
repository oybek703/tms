import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch } from 'react-redux'
import { fetchMainIndicators } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import MainIndicatorsTable from '../../tables/MainIndicatorsTable'
import useTypedSelector from '../../../hooks/useTypedSelector'

const MainIndicators = () => {
    const dispatch = useDispatch()
    const { mainIndicators, loading, error } = useTypedSelector(
      state => state.mainIndicators)
    const { reportDate } = useTypedSelector(state => state.date)
    useEffect(() => {
        dispatch(fetchMainIndicators(reportDate))
    }, [dispatch, reportDate])
    return (
      <>
          <PageTitle title='Основные показатели банка'/>
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