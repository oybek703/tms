import React, { Fragment, useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import useTypedSelector from '../../hooks/useTypedSelector'
import VLaBufferTable from '../../components/tables/VlaBufferTable'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const VlaBuffer = () => {
	const { fetchVlaBuffer } = useActions()
	const { loading, error } = useTypedSelector(state => state.vlaBuffer)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchVlaBuffer()
	}, [fetchVlaBuffer, reportDate])
	return (
		<Fragment>
			<PageTitle title="Информация о состояние баланса и ликвидности" />
			<LoaderWrapper loading={loading} error={error}>
				<VLaBufferTable />
			</LoaderWrapper>
		</Fragment>
	)
}

export default VlaBuffer
