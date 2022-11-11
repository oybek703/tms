import React, { Fragment, useEffect } from 'react'
import PageTitle from '../../components/UI/Layout/PageTitle'
import Loader from '../../components/UI/Layout/Loader'
import Alert from '../../components/UI/Layout/Alert'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import FilialEffectivenessTable from '../../components/tables/FilialEffectivenessTable'

const FilialEffectiveness = () => {
	const { fetchFilialEffectiveness } = useActions()
	const { filialEffectiveness, loading, error } = useTypedSelector(state => state.filialEffectiveness)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchFilialEffectiveness()
	}, [fetchFilialEffectiveness, reportDate])
	return (
		<Fragment>
			<PageTitle title="Анализ эффективности филиалов" />
			{loading ? (
				<Loader />
			) : error ? (
				<Alert message={error} />
			) : (
				<FilialEffectivenessTable rows={filialEffectiveness} />
			)}
		</Fragment>
	)
}

export default FilialEffectiveness
