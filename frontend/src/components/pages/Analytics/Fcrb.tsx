import React, { Fragment, useEffect } from 'react'
import Loader from '../../UI/Layout/Loader'
import { useDispatch } from 'react-redux'
import { fetchFcrb } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import FcrbTable from '../../tables/FcrbTable'
import useTypedSelector from '../../../hooks/useTypedSelector'

const Fcrb = () => {
    const dispatch = useDispatch()
    const {
        fcrb,
        loading,
        error
    } = useTypedSelector(state => state.fcrb)
    const {reportDate} = useTypedSelector(state => state.date)
    useEffect(() => {
        dispatch(fetchFcrb(reportDate))
    }, [reportDate, dispatch])
    return (
        <Fragment>
            {loading
                ? <Loader/>
                : error
                    ? <Alert message={error}/>
                    : <FcrbTable rows={fcrb}/>}
        </Fragment>
    )
}

export default Fcrb