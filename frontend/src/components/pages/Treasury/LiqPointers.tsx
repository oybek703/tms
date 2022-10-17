import React, { useEffect, useState } from 'react'
import PageTitle from '../../UI/Layout/PageTitle'
import LiqPointersTable from '../../tables/LiqPointersTable'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'

const LiqPointers = () => {
	const { fetchLiquidity, fetchLiquidityCurrent } = useActions()
	const { reportDate } = useTypedSelector(state => state.date)
	const { liquidity, loading, error } = useTypedSelector(state => state.liquidity)
	const currentState = useTypedSelector(state => state.liquidityCurrentState)
	const [liquidityData, setLiquidityData] = useState(liquidity)
	const {
		liquidity: currentLiquidity,
		loading: currentLoading,
		error: currentError
	} = useTypedSelector(state => state.liquidityCurrent)
	useEffect(() => {
		if (currentState) {
			fetchLiquidityCurrent()
			setLiquidityData(currentLiquidity)
		} else {
			fetchLiquidity(reportDate)
			setLiquidityData(currentLiquidity)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchLiquidityCurrent, fetchLiquidity, reportDate, currentState])
	useEffect(() => {
		if (!currentState) {
			setLiquidityData(liquidity)
		} else {
			setLiquidityData(currentLiquidity)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [liquidity, currentLiquidity])
	return (
		<>
			<PageTitle title="Информация о состоянии баланса и мгновенной ликвидности банка" />
			{loading || (currentLoading && currentState) ? (
				<Loader />
			) : error || currentError ? (
				<Alert message={error || currentError} />
			) : (
				<LiqPointersTable rows={liquidityData} currentState={currentState} />
			)}
		</>
	)
}

export default LiqPointers
