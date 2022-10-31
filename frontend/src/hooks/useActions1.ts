import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useMemo } from 'react'
import { operDaysActions, getOperDays, getDashBoardLastUpdate } from '../features/operDays/operDaysSlice'
import { dashboardActions, fetchDashboard } from '../features/dashboard/dashboardSlice'
import { fetchMainIndicators } from '../features/mainIndicators/mainIndicatorsSlice'
import { fetchFcrb } from '../features/fcrb/fcrbSlice'
import { fetchCalcFor } from '../features/calcFor/calcForSlice'
import { fetchCapital } from '../features/capital/capitalSlice'
import { fetchProfitAndLost } from '../features/profitAndLost/profitAndLostSlice'
import { fetchLiquidity, fetchLiquidityCurrent, liquidityActions } from '../features/liquidity/liquiditySlice'
import {
	fetchCorrespondent,
	fetchCorrespondentCurrent,
	correspondentActions
} from '../features/correspondent/correspondentSlice'
import { fetchCurrencyPosition } from '../features/currencyPosition/currencyPositionSlice'
import { fetchDashboardMonthly } from '../features/dashboardMonthly/dashboardMonthlySlice'
import { fetchDashboardCreditData } from '../features/creditData/creditDataSlice'
import { fetchNostroMatrix } from '../features/nostroMatrix/nostroMatrixSlice'
import { fetchVlaBuffer } from '../features/vlaBuffer/vlaBufferSlice'
import { fetchPlat } from '../features/plat/platSlice'
import { fetchInterbankDeposits } from '../features/interbankDeposits/interbankDepositsSlice'
import { fetchTopDeposits } from '../features/topDeposits/topDepositsSlice'
import { fetchTimeDepoClients } from '../features/timeDepoClients/timeDepoClientsSlice'
import { fetchTimeDeposits } from '../features/timeDeposits/timeDepositsSlice'
import { fetchDepositsByDeadline } from '../features/depositsByDeadline/depositsByDeadlineSlice'
import { fetchReportLiabilities } from '../features/reportLiabilities/reportLiabilitiesSlice'
import { fetchFilialEffectiveness } from '../features/filialEffectiveness/filialEffectivenessSlice'
import { fetchGM } from '../features/gm/gmSlice'
import { fetchGap, fetchGapSimulation, fetchLastGapUpdateTime } from '../features/gap/gapSlice'
import { login } from '../features/auth/authSlice'
import { deleteUserByName, fetchSingleUser, fetchUsers } from '../features/admin/adminSlice'

const actions = {
	...operDaysActions,
	getOperDays,
	getDashBoardLastUpdate,
	...dashboardActions,
	fetchDashboard,
	fetchDashboardCreditData,
	fetchMainIndicators,
	fetchFcrb,
	fetchCalcFor,
	fetchCapital,
	fetchProfitAndLost,
	fetchLiquidity,
	fetchLiquidityCurrent,
	...liquidityActions,
	fetchCorrespondent,
	fetchCorrespondentCurrent,
	...correspondentActions,
	fetchCurrencyPosition,
	fetchDashboardMonthly,
	fetchNostroMatrix,
	fetchVlaBuffer,
	fetchPlat,
	fetchInterbankDeposits,
	fetchTopDeposits,
	fetchTimeDepoClients,
	fetchTimeDeposits,
	fetchDepositsByDeadline,
	fetchReportLiabilities,
	fetchFilialEffectiveness,
	fetchGM,
	fetchGap,
	fetchLastGapUpdateTime,
	fetchGapSimulation,
	login,
	fetchUsers,
	fetchSingleUser,
	deleteUserByName
}

const useActions1 = function () {
	const dispatch = useDispatch()
	return useMemo(() => {
		return bindActionCreators(actions, dispatch)
	}, [dispatch])
}

export default useActions1
