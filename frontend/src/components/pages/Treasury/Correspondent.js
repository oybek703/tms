import React, { useEffect, useState } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchCorrespondent,
    fetchCorrespondentCurrent
} from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import CorrespondentTable from '../../tables/CorrespondentTable'

const Correspondent = () => {
    const dispatch = useDispatch()
    const { reportDate } = useSelector(state => state.date)
    const currentState = useSelector(state => state.correspondentCurrentState)
    const { correspondent, loading, error } = useSelector(
      state => state.correspondent)
    const [correspondentData, setCorrespondentData] = useState(correspondent)
    const {
        correspondent: currentCorrespondent,
        loading: currentLoading,
        error: currentError
    } = useSelector(state => state.correspondentCurrent)
    useEffect(() => {
        if (currentState) {
            dispatch(fetchCorrespondentCurrent())
            setCorrespondentData(currentCorrespondent)
        } else {
            dispatch(fetchCorrespondent(reportDate))
            setCorrespondentData(correspondent)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, reportDate, currentState])
    useEffect(() => {
        if (!currentState) {
            setCorrespondentData(correspondent)
        } else {
            setCorrespondentData(currentCorrespondent)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [correspondent, currentCorrespondent])
    return (
      <>
          <PageTitle title='Информация о ликвидных средствах банка'/>
          {loading || (currentLoading && currentState) ?
            <Loader/> :
            error || currentError ? <Alert message={error || currentError}/>
              :
              <CorrespondentTable currentState={currentState}
                                  rows={correspondentData}/>}
      </>
    )
}

export default Correspondent