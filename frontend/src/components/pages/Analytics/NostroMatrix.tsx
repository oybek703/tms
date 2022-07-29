import React, { Fragment, useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'
import NostroMatrixTable from '../../tables/NostroMatrixTable'

const NostroMatrix = () => {
  const { fetchNostroMatrix } = useActions()
  const { nostroMatrix, loading, error } = useTypedSelector((state) => state.nostroMatrix)
  const { reportDate } = useTypedSelector((state) => state.date)
  useEffect(() => {
    fetchNostroMatrix(reportDate)
  }, [fetchNostroMatrix, reportDate])
  return (
    <Fragment>
      <PageTitle title='Матрица валютных корр. счетов банка'/>
      {loading ?
                <Loader/> :
                error ? <Alert message={error}/> :
                    <NostroMatrixTable rows={nostroMatrix}/>}
    </Fragment>
  )
}

export default NostroMatrix
