import React, { useEffect, useState } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import CorrespondentTable from '../../tables/CorrespondentTable'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'

const Correspondent = () => {
  const { fetchCorrespondent, fetchCorrespondentCurrent } = useActions()
  const { reportDate } = useTypedSelector((state) => state.date)
  const currentState = useTypedSelector((state) => state.correspondentCurrentState)
  const { correspondent, loading, error } = useTypedSelector(
      (state) => state.correspondent)
  let [correspondentData, setCorrespondentData] = useState(correspondent)
  const {
    correspondent: currentCorrespondent,
    loading: currentLoading,
    error: currentError,
  } = useTypedSelector((state) => state.correspondentCurrent)
  useEffect(() => {
    if (currentState) {
      fetchCorrespondentCurrent()
      setCorrespondentData(currentCorrespondent)
    } else {
      fetchCorrespondent(reportDate)
      setCorrespondentData(correspondent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCorrespondent, fetchCorrespondentCurrent, reportDate, currentState])
  useEffect(() => {
    if (!currentState) {
      setCorrespondentData(correspondent)
    } else {
      setCorrespondentData(currentCorrespondent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correspondent, currentCorrespondent])
  if (!correspondentData) correspondentData = {}
  return (
    <>
      <PageTitle title='Информация о ликвидных средствах банка'/>
      {loading || (currentLoading && currentState) ?
            <Loader/> :
            error || currentError ? <Alert message={error || currentError}/> :
              <CorrespondentTable currentState={currentState}
                rows={correspondentData}/>}
    </>
  )
}

export default Correspondent
