import React, { Fragment, useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDepositsByDeadline } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import DepositsByDeadlineTable from '../../tables/DepositsByDeadlineTable'

const DepositsByDeadline = () => {
    const dispatch = useDispatch()
    const {depositsbydeadline, loading, error} = useSelector(state => state.depositsByDeadline)
    const {reportDate} = useSelector(state => state.date)
    useEffect(() => {
        dispatch(fetchDepositsByDeadline(reportDate))
    }, [dispatch, reportDate])
    return (
        <Fragment>
            <PageTitle title='Депозиты юридических лиц. по срокам возврата'/>
            {loading ?
                <Loader/> :
                error ? <Alert message={error}/>
                    :
                    <DepositsByDeadlineTable rows={depositsbydeadline}/>}
        </Fragment>
    )
}

export default DepositsByDeadline