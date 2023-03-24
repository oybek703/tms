import React, { Fragment, useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'
import VlaAndForTable from '../../components/tables/VlaAndForTable'

const VlaAndFor = () => {
	const { fetchVlaAndFor } = useActions()
	const { loading, error } = useTypedSelector(state => state.vlaAndFor)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchVlaAndFor()
	}, [fetchVlaAndFor, reportDate])
	return (
		<Fragment>
			<PageTitle title="Управление ВЛА и ФОР" />
			<LoaderWrapper loading={loading} error={error}>
				<VlaAndForTable />
			</LoaderWrapper>
		</Fragment>
	)
}

export default VlaAndFor
