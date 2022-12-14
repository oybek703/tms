import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import GAPTable from '../../components/tables/GAPTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import LastUpdate from '../../components/layout/Navigation/LastUpdate'
import { toast } from 'react-toastify'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

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
			<LoaderWrapper loading={loading} error={error}>
				<GAPTable rows={gap} />
			</LoaderWrapper>
		</>
	)
}

export default GAP
