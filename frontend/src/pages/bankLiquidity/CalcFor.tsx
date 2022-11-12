import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import useTypedSelector from '../../hooks/useTypedSelector'
import CalcForTable from '../../components/tables/CalcForTable'
import useActions from '../../hooks/useActions'

interface CalcForProps {
	forDashboard: boolean
}

const CalcFor: React.FC<CalcForProps> = ({ forDashboard = false }) => {
	const { fetchCalcFor } = useActions()
	const { calcFor = [], loading, error } = useTypedSelector(state => state.calcFor)
	const { reportDate } = useTypedSelector(state => state.operDays)
	const { DATE_VALUE: startDate }: any = [...calcFor].shift() || {}
	const { DATE_VALUE: endDate }: any = [...calcFor].pop() || {}
	useEffect(() => {
		fetchCalcFor()
	}, [reportDate, fetchCalcFor])
	useEffect(() => {
		window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
	}, [])
	return (
		<>
			{!forDashboard && (
				<PageTitle title={`РАСЧЕТ ФОР ${loading || !(startDate && endDate) ? '' : `C ${startDate} - ${endDate}`}`} />
			)}
			{loading ? (
				<Loader />
			) : error ? (
				<Alert message={error} />
			) : (
				<CalcForTable forDashboard={forDashboard} rows={calcFor} />
			)}
		</>
	)
}

export default CalcFor
