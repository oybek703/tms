import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import { useDispatch } from 'react-redux'
import { fetchPlat } from '../../../redux/actions'
import Alert from '../../UI/Layout/Alert'
import PlacedAndAttractedTable from '../../tables/PlacedAndAttractedTable'
import useTypedSelector from '../../../hooks/useTypedSelector'

interface PlacedAndAttractedProps {
    forDashboard?: boolean
}

const PlacedAndAttracted: React.FC<PlacedAndAttractedProps> = ({ forDashboard = false }) => {
    const dispatch = useDispatch()
    const { plat, loading, error } = useTypedSelector(state => state.plat)
    const { reportDate } = useTypedSelector(state => state.date)
    useEffect(() => {
        dispatch(fetchPlat(reportDate))
    }, [dispatch, reportDate])
    useEffect(() => {window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })},
      [])
    return (
      <>
          {!forDashboard && <PageTitle title='Информация о привлеченных и размещенных средствах банка'/>}
          {loading ?
            <Loader/> :
            error ? <Alert message={error}/>
              :
              <PlacedAndAttractedTable forDashboard={forDashboard} rows={plat}/>}
      </>
    )
}

export default PlacedAndAttracted