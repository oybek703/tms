import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch } from 'react-redux'
import { fetchGap } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import GAPTable from '../../tables/GAPTable'
import useTypedSelector from '../../../hooks/useTypedSelector'

const GAP = () => {
    const dispatch = useDispatch()
    const {gap, loading, error} = useTypedSelector(state => state.gap)
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