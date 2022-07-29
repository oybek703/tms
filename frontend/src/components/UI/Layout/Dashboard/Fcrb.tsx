import React, { Fragment, useEffect } from 'react'
import Loader from '../Loader'
import Alert from '../Alert'
import FcrbTable from '../../../tables/FcrbTable'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import useActions from '../../../../hooks/useActions'

const Fcrb = () => {
  const { fetchFcrb } = useActions()
  const {
    fcrb,
    loading,
    error,
  } = useTypedSelector((state) => state.fcrb)
  const { reportDate } = useTypedSelector((state) => state.date)
  useEffect(() => {
    fetchFcrb(reportDate)
  }, [reportDate, fetchFcrb])
  return (
    <Fragment>
      {loading ?
                <Loader/> :
                error ?
                    <Alert message={error}/> :
                    <FcrbTable rows={fcrb}/>}
    </Fragment>
  )
}

export default Fcrb
