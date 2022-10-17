import React, { useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import GAPTable from '../../tables/GAPTable'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'
import LastUpdate from '../../UI/Layout/Navigation/LastUpdate'
import { toast } from 'react-toastify'

const GAP = () => {
	const { fetchGap, getLastGapUpdate } = useActions()
	const { gap, loading, error } = useTypedSelector(state => state.gap)
	const {
		lastGapUpdate,
		loading: lastGapUpdateLoading,
		error: lastGapUpdateError
	} = useTypedSelector(state => state.lastGapUpdate)
	useEffect(() => {
		fetchGap()
		getLastGapUpdate()
		if (lastGapUpdateError) toast(lastGapUpdateError, { position: 'bottom-right' })
	}, [lastGapUpdateError, fetchGap, getLastGapUpdate])
	return (
		<>
			<PageTitle
				additionalContent={
					<>
						{!loading && !error && !lastGapUpdateLoading && !lastGapUpdateError && <LastUpdate label={lastGapUpdate} />}
					</>
				}
				title="Анализ ликвидности по источникам и потребности"
			/>
			{loading ? <Loader /> : error ? <Alert message={error} /> : <GAPTable rows={gap} />}
		</>
	)
}

export default GAP
