import React, { useEffect } from 'react'
import PageTitle from '../../components/UI/Layout/PageTitle'
import CapitalTable from '../../components/tables/CapitalTable'
import Loader from '../../components/UI/Layout/Loader'
import Alert from '../../components/UI/Layout/Alert'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions1 from '../../hooks/useActions1'

const Capital = () => {
	const { fetchCapital } = useActions1()
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
