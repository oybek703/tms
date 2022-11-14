import React, { Fragment, useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import useTypedSelector from '../../hooks/useTypedSelector'
import VLaBufferTable from '../../components/tables/VlaBufferTable'
import useActions from '../../hooks/useActions'

const VlaBuffer = () => {
	const { fetchVlaBuffer } = useActions()
	const { vlaBuffer, loading, error } = useTypedSelector(state => state.vlaBuffer)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchVlaBuffer()
	}, [fetchVlaBuffer, reportDate])
	return (
		<Fragment>
			<PageTitle title="Информация о состояние баланса и ликвидности" />
			{loading ? <Loader /> : error ? <Alert message={error} /> : <VLaBufferTable rows={vlaBuffer as any} />}
		</Fragment>
	)
}

export default VlaBuffer
