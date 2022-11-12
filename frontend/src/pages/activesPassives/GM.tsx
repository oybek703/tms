import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import GMTable from '../../components/tables/GMTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'

const GM = () => {
	const { fetchGM } = useActions()
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
