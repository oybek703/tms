import React, { Fragment, useEffect } from 'react'
import PageTitle from '../../components/UI/Layout/PageTitle'
import Loader from '../../components/UI/Layout/Loader'
import Alert from '../../components/UI/Layout/Alert'
import useTypedSelector from '../../hooks/useTypedSelector'
import VLaBufferTable from '../../components/tables/VlaBufferTable'
import useActions1 from '../../hooks/useActions1'

const VlaBuffer = () => {
	const { fetchVlaBuffer } = useActions1()
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
