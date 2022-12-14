import React, { useEffect, useState } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import LiqPointersTable from '../../components/tables/LiqPointersTable'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

const LiqPointers = () => {
	const { fetchLiquidity, fetchLiquidityCurrent } = useActions()
	const { reportDate } = useTypedSelector(state => state.operDays)
	const { liquidity, loading, error, currentState, currentLiquidityLoading, currentLiquidityError, currentLiquidity } =
		useTypedSelector(state => state.liquidity)
	const [liquidityData, setLiquidityData] = useState(liquidity)
	useEffect(() => {
		if (currentState) {
			fetchLiquidityCurrent()
			setLiquidityData(currentLiquidity)
		} else {
			fetchLiquidity()
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
			<LoaderWrapper
				loading={loading || (currentLiquidityLoading && currentState)}
				error={error || currentLiquidityError}
			>
				<LiqPointersTable rows={liquidityData} currentState={currentState} />
			</LoaderWrapper>
		</>
	)
}

export default LiqPointers
