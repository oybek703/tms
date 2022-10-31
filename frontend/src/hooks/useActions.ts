import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useMemo } from 'react'
import { operDaysActions, getOperDays, getDashBoardLastUpdate } from '../features/operDays/operDaysSlice'
import { dashboardActions, fetchDashboard } from '../features/Analytics/dashboard/dashboardSlice'
import { fetchMainIndicators } from '../features/Treasury/mainIndicators/mainIndicatorsSlice'
import { fetchFcrb } from '../features/Analytics/fcrb/fcrbSlice'
import { fetchCalcFor } from '../features/Treasury/calcFor/calcForSlice'
import { fetchCapital } from '../features/Treasury/capital/capitalSlice'
import { fetchProfitAndLost } from '../features/Treasury/profitAndLost/profitAndLostSlice'
import { fetchLiquidity, fetchLiquidityCurrent, liquidityActions } from '../features/Treasury/liquidity/liquiditySlice'
import {
	fetchCorrespondent,
	fetchCorrespondentCurrent,
	correspondentActions
} from '../features/Treasury/correspondent/correspondentSlice'
import { fetchCurrencyPosition } from '../features/Treasury/currencyPosition/currencyPositionSlice'
import { fetchDashboardMonthly } from '../features/Analytics/dashboardMonthly/dashboardMonthlySlice'
import { fetchDashboardCreditData } from '../features/Treasury/creditData/creditDataSlice'
import { fetchNostroMatrix } from '../features/Analytics/nostroMatrix/nostroMatrixSlice'
import { fetchVlaBuffer } from '../features/Analytics/vlaBuffer/vlaBufferSlice'
import { fetchPlat } from '../features/Treasury/plat/platSlice'
import { fetchInterbankDeposits } from '../features/Treasury/interbankDeposits/interbankDepositsSlice'
import { fetchTopDeposits } from '../features/Treasury/topDeposits/topDepositsSlice'
import { fetchTimeDepoClients } from '../features/Treasury/timeDepoClients/timeDepoClientsSlice'
import { fetchTimeDeposits } from '../features/Treasury/timeDeposits/timeDepositsSlice'
import { fetchDepositsByDeadline } from '../features/Analytics/depositsByDeadline/depositsByDeadlineSlice'
import { fetchReportLiabilities } from '../features/Analytics/reportLiabilities/reportLiabilitiesSlice'
import { fetchFilialEffectiveness } from '../features/Analytics/filialEffectiveness/filialEffectivenessSlice'
import { fetchGM } from '../features/Treasury/gm/gmSlice'
import { fetchGap, fetchGapSimulation, fetchLastGapUpdateTime } from '../features/Analytics/gap/gapSlice'
import { authActions, login } from '../features/auth/authSlice'
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
	...authActions,
	login,
	fetchUsers,
	fetchSingleUser,
	deleteUserByName
}

const useActions = function () {
	const dispatch = useDispatch()
	return useMemo(() => {
		return bindActionCreators(actions, dispatch)
	}, [dispatch])
}

export default useActions
