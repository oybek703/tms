import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import GAPTable from '../../components/tables/GAPTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import LastUpdate from '../../components/layout/Navigation/LastUpdate'
import { toast } from 'react-toastify'
import useActions from '../../hooks/useActions'

const GAP = () => {
	const { fetchGap, fetchLastGapUpdateTime } = useActions()
	const { gap, loading, error, lastUpdateError, lastUpdateLoading, lastUpdate } = useTypedSelector(state => state.gap)
	useEffect(() => {
		fetchGap()
		fetchLastGapUpdateTime()
		if (lastUpdateError) toast(lastUpdateError, { position: 'bottom-right' })
	}, [lastUpdateError, fetchGap, fetchLastGapUpdateTime])
	return (
		<>
			<PageTitle
				additionalContent={
					<>{!loading && !error && !lastUpdateLoading && !lastUpdateError && <LastUpdate label={lastUpdate} />}</>
				}
				title="Анализ ликвидности по источникам и потребности"
			/>
			{loading ? <Loader /> : error ? <Alert message={error} /> : <GAPTable rows={gap} />}
		</>
	)
}

export default GAP
