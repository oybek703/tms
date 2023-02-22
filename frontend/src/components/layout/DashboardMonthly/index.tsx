import React, { Fragment, useEffect, useState } from 'react'
import Alert from '../Alert'
import Loader from '../Loader'
import useTypedSelector from '../../../hooks/useTypedSelector'
import DashboardMonthlyTable from './DashboardMonthlyTable'
import useActions from '../../../hooks/useActions'
import useTwoDates from '../../../hooks/useTwoDates'

const DashboardMonthly: React.FC = () => {
	const { fetchDashboardMonthly } = useActions()
	const [dateOption, setDateOption] = useState('two')
	const { dashboardMonthly, loading, error } = useTypedSelector(state => state.dashboardMonthly)
	const { firstDate, secondDate, handleDateChange } = useTwoDates()
	useEffect(() => {
		if (firstDate && secondDate && firstDate !== secondDate) {
			fetchDashboardMonthly({ firstDate, secondDate, dateOption })
		}
	}, [fetchDashboardMonthly, firstDate, secondDate, dateOption])
	return (
		<Fragment>
			{loading ? (
				<Loader />
			) : error ? (
				<Alert message={error} />
			) : (
				<>
					<DashboardMonthlyTable
						firstDate={firstDate}
						secondDate={secondDate}
						handleDateChange={handleDateChange}
						rows={dashboardMonthly}
					/>
				</>
			)}
		</Fragment>
	)
}

export default DashboardMonthly
