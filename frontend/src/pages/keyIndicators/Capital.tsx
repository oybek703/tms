import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import CapitalTable from '../../components/tables/CapitalTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const Capital = () => {
	const { fetchCapital } = useActions()
	const { loading, error } = useTypedSelector(state => state.capital)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchCapital()
	}, [reportDate, fetchCapital])
	return (
		<>
			<PageTitle title="Расчет капитала банка" />
			<LoaderWrapper loading={loading} error={error}>
				<CapitalTable />
			</LoaderWrapper>
		</>
	)
}

export default Capital
