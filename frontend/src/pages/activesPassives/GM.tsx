import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import GMTable from '../../components/tables/GMTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const GM = () => {
	const { fetchGM } = useActions()
	const { loading, error } = useTypedSelector(state => state.gm)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchGM()
	}, [reportDate, fetchGM])
	return (
		<>
			<PageTitle title='Короткая информация АО "UzAuto Motors"' />
			<LoaderWrapper loading={loading} error={error}>
				<GMTable />
			</LoaderWrapper>
		</>
	)
}

export default GM
