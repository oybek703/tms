import React, { Fragment, useEffect } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'
import VLaBufferTable from '../../tables/VlaBufferTable'

const VlaBuffer = () => {
	const { fetchVlaBuffer } = useActions()
	const { vlaBuffer, loading, error } = useTypedSelector(state => state.vlaBuffer)
	const { reportDate } = useTypedSelector(state => state.date)
	useEffect(() => {
		fetchVlaBuffer(reportDate)
	}, [fetchVlaBuffer, reportDate])
	return (
		<Fragment>
			<PageTitle title="Информация о состояние баланса и ликвидности" />
			{loading ? <Loader /> : error ? <Alert message={error} /> : <VLaBufferTable rows={vlaBuffer} />}
		</Fragment>
	)
}

export default VlaBuffer
