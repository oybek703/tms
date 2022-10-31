import React, { useEffect } from 'react'
import PageTitle from '../../components/UI/Layout/PageTitle'
import Loader from '../../components/UI/Layout/Loader'
import Alert from '../../components/UI/Layout/Alert'
import GAPTable from '../../components/tables/GAPTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import LastUpdate from '../../components/UI/Layout/Navigation/LastUpdate'
import { toast } from 'react-toastify'
import useActions1 from '../../hooks/useActions1'

const GAP = () => {
	const { fetchGap, fetchLastGapUpdateTime } = useActions1()
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
