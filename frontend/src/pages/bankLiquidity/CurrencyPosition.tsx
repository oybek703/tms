import React, { useEffect } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import useTypedSelector from '../../hooks/useTypedSelector'
import CurrencyPositionTable from '../../components/tables/CurrencyPositionTable'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const CurrencyPosition = () => {
	const { fetchCurrencyPosition } = useActions()
	const { loading, error } = useTypedSelector(state => state.currencyPosition)
	const { reportDate } = useTypedSelector(state => state.operDays)
	useEffect(() => {
		fetchCurrencyPosition()
	}, [fetchCurrencyPosition, reportDate])
	return (
		<>
			<PageTitle title="Сведения об открытых валютных позициях банка" />
			<LoaderWrapper loading={loading} error={error}>
				<CurrencyPositionTable />
			</LoaderWrapper>
		</>
	)
}

export default CurrencyPosition
