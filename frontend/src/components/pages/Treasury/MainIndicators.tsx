import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import MainIndicatorsTable from '../../tables/MainIndicatorsTable'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'

const MainIndicators = () => {
  const { fetchMainIndicators } = useActions()
  const { mainIndicators, loading, error } = useTypedSelector(
      (state) => state.mainIndicators)
  const { reportDate } = useTypedSelector((state) => state.date)
  useEffect(() => {
    fetchMainIndicators(reportDate)
  }, [fetchMainIndicators, reportDate])
  return (
    <>
      <PageTitle title='Основные показатели банка'/>
      {loading ?
        <Loader/> :
        error ? <Alert message={error}/> :
          <MainIndicatorsTable pickedDate={reportDate}
            rows={mainIndicators}/>}
    </>
  )
}

export default MainIndicators
