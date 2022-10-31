import React, { useEffect } from 'react'
import PageTitle from '../../components/UI/Layout/PageTitle'
import Loader from '../../components/UI/Layout/Loader'
import Alert from '../../components/UI/Layout/Alert'
import GMTable from '../../components/tables/GMTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions1 from '../../hooks/useActions1'

const GM = () => {
	const { fetchGM } = useActions1()
	const { gm, loading, error } = useTypedSelector(state => state.gm)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchGM()
	}, [reportDate, fetchGM])
	return (
		<>
			<PageTitle title='Короткая информация АО "UzAuto Motors"' />
			{loading ? <Loader /> : error ? <Alert message={error} /> : <GMTable rows={gm} />}
		</>
	)
}

export default GM
