import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch } from 'react-redux'
import { fetchGM } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import GMTable from '../../tables/GMTable'
import useTypedSelector from '../../../hooks/useTypedSelector'

const GM = () => {
    const dispatch = useDispatch()
    const {gm, loading, error} = useTypedSelector(state => state.gm)
    const {reportDate} = useTypedSelector(state => state.date)
    useEffect(() => {
        dispatch(fetchGM(reportDate))
    }, [reportDate, dispatch])
    return (
        <>
            <PageTitle title='Короткая информация АО "UzAuto Motors"'/>
            {loading
                ? <Loader/>
                : error
                    ? <Alert message={error}/>
                    : <GMTable rows={gm}/>}
        </>
    )
}

export default GM