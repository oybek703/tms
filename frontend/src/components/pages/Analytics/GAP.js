import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGap } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import GAPTable from '../../tables/GAPTable'

const GAP = () => {
    const dispatch = useDispatch()
    const {gap, loading, error} = useSelector(state => state.gap)
    useEffect(() => {
        dispatch(fetchGap())
    }, [dispatch])
    return (
        <>
            <PageTitle title='Анализ ликвидности по источникам и потребности'/>
            {loading
                ? <Loader/>
                : error
                    ? <Alert message={error}/>
                    : <GAPTable rows={gap}/>}
        </>
    )
}

export default GAP