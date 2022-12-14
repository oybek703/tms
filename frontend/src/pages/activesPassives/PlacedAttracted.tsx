import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import PlacedAndAttractedTable from '../../components/tables/PlacedAndAttractedTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

interface PlacedAndAttractedProps {
	forDashboard?: boolean
}

const PlacedAndAttracted: React.FC<PlacedAndAttractedProps> = ({ forDashboard = false }) => {
	const { fetchPlat } = useActions()
	const { loading, error } = useTypedSelector(state => state.plat)
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
			<LoaderWrapper loading={loading} error={error}>
				<PlacedAndAttractedTable forDashboard={forDashboard} />
			</LoaderWrapper>
		</>
	)
}

export default PlacedAndAttracted
