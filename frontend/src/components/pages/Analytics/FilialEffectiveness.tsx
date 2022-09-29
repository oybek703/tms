import React, { Fragment, useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'
import FilialEffectivenessTable from '../../tables/FilialEffectivenessTable'

const FilialEffectiveness = () => {
  const { fetchFilialEffectiveness } = useActions()
  const { filialEffectiveness, loading, error } = useTypedSelector(state => state.filialEffectiveness)
  const { reportDate } = useTypedSelector(state => state.date)
  useEffect(() => {
    fetchFilialEffectiveness(reportDate)
  }, [fetchFilialEffectiveness, reportDate])
  return (
    <Fragment>
      <PageTitle title='Анализ эффективности филиалов'/>
      {loading ?
                <Loader/> :
                error ? <Alert message={error}/> :
                    <FilialEffectivenessTable rows={filialEffectiveness}/>}
    </Fragment>
  )
}

export default FilialEffectiveness
