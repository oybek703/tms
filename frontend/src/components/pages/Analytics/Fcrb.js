import React, {Fragment, useEffect} from 'react'
import Loader from '../../UI/Layout/Loader'
import {useDispatch, useSelector} from 'react-redux'
import {fetchFcrb} from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import FcrbTable from '../../tables/FcrbTable'

const Fcrb = () => {
    const dispatch = useDispatch()
    const {
        fcrb,
        loading,
        error
    } = useSelector(state => state.fcrb)
    const {reportDate} = useSelector(state => state.date)
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