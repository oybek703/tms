import React, { Fragment, useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch } from 'react-redux'
import { fetchDepositsByDeadline } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import DepositsByDeadlineTable from '../../tables/DepositsByDeadlineTable'
import useTypedSelector from '../../../hooks/useTypedSelector'

const DepositsByDeadline = () => {
    const dispatch = useDispatch()
    const {depositsbydeadline, loading, error} = useTypedSelector(state => state.depositsByDeadline)
    const {reportDate} = useTypedSelector(state => state.date)
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