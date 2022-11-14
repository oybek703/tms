import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import CapitalTable from '../../components/tables/CapitalTable'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'

const Capital = () => {
	const { fetchCapital } = useActions()
	const { capital, loading, error } = useTypedSelector(state => state.capital)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchCapital()
	}, [reportDate, fetchCapital])
	return (
		<>
			<PageTitle title="Расчет капитала банка" />
			{loading ? <Loader /> : error ? <Alert message={error} /> : <CapitalTable rows={capital} />}
		</>
	)
}

export default Capital
