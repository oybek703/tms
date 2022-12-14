import React, { Fragment, useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import FilialEffectivenessTable from '../../components/tables/FilialEffectivenessTable'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const FilialEffectiveness = () => {
	const { fetchFilialEffectiveness } = useActions()
	const { loading, error } = useTypedSelector(state => state.filialEffectiveness)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchFilialEffectiveness()
	}, [fetchFilialEffectiveness, reportDate])
	return (
		<Fragment>
			<PageTitle title="Анализ эффективности филиалов" />
			<LoaderWrapper loading={loading} error={error}>
				<FilialEffectivenessTable />
			</LoaderWrapper>
		</Fragment>
	)
}

export default FilialEffectiveness
