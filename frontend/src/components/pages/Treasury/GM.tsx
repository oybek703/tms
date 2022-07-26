import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import GMTable from '../../tables/GMTable'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'

const GM = () => {
    const { fetchGM } = useActions()
    const {gm, loading, error} = useTypedSelector(state => state.gm)
    const {reportDate} = useTypedSelector(state => state.date)
    useEffect(() => {
        fetchGM(reportDate)
    }, [reportDate, fetchGM])
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
