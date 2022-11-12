import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import PlacedAndAttractedTable from '../../components/tables/PlacedAndAttractedTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'

interface PlacedAndAttractedProps {
	forDashboard?: boolean
}

const PlacedAndAttracted: React.FC<PlacedAndAttractedProps> = ({ forDashboard = false }) => {
	const { fetchPlat } = useActions()
	const { plat, loading, error } = useTypedSelector(state => state.plat)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchPlat()
	}, [fetchPlat, reportDate])
	useEffect(() => {
		window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
	}, [])
	return (
		<>
			{!forDashboard && <PageTitle title="Информация о привлеченных и размещенных средствах банка" />}
			{loading ? (
				<Loader />
			) : error ? (
				<Alert message={error} />
			) : (
				<PlacedAndAttractedTable forDashboard={forDashboard} rows={plat} />
			)}
		</>
	)
}

export default PlacedAndAttracted
