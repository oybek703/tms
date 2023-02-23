import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useMemo } from 'react'
import { getDashBoardLastUpdate, getOperDays, operDaysActions } from '../features/dashboard/operDays/operDaysSlice'
import { dashboardActions, fetchDashboard } from '../features/dashboard/dashboard/dashboardSlice'
import { fetchMainIndicators } from '../features/keyIndicators/mainIndicators/mainIndicatorsSlice'
import { fetchCalcFor } from '../features/bankLiquidity/calcFor/calcForSlice'
import { fetchCapital } from '../features/keyIndicators/capital/capitalSlice'
import { fetchProfitAndLost } from '../features/keyIndicators/profitAndLost/profitAndLostSlice'
import {
	fetchLiquidity,
	fetchLiquidityCurrent,
	liquidityActions
} from '../features/bankLiquidity/liquidity/liquiditySlice'
import {
	correspondentActions,
	fetchCorrespondent,
	fetchCorrespondentCurrent
} from '../features/bankLiquidity/correspondent/correspondentSlice'
import { fetchCurrencyPosition } from '../features/bankLiquidity/currencyPosition/currencyPositionSlice'
import { fetchDashboardMonthly } from '../features/dashboard/dashboardMonthly/dashboardMonthlySlice'
import { fetchDashboardCreditData } from '../features/dashboard/creditData/creditDataSlice'
import { fetchNostroMatrix } from '../features/bankLiquidity/nostroMatrix/nostroMatrixSlice'
import { fetchVlaBuffer } from '../features/bankLiquidity/vlaBuffer/vlaBufferSlice'
import { fetchPlat } from '../features/activesPassives/plat/platSlice'
import { fetchInterbankDeposits } from '../features/activesPassives/interbankDeposits/interbankDepositsSlice'
import { fetchTopDeposits } from '../features/activesPassives/topDeposits/topDepositsSlice'
import { fetchTimeDepoClients } from '../features/activesPassives/timeDepoClients/timeDepoClientsSlice'
import { fetchTimeDeposits } from '../features/activesPassives/timeDeposits/timeDepositsSlice'
import { fetchDepositsByDeadline } from '../features/activesPassives/depositsByDeadline/depositsByDeadlineSlice'
import { fetchReportLiabilities } from '../features/activesPassives/reportLiabilities/reportLiabilitiesSlice'
import { fetchFilialEffectiveness } from '../features/activesPassives/filialEffectiveness/filialEffectivenessSlice'
import { fetchGM } from '../features/activesPassives/gm/gmSlice'
import { fetchGap, fetchGapSimulation, fetchLastGapUpdateTime } from '../features/gap/gapSlice'
import { authActions, login } from '../features/auth/authSlice'
import { deleteUserByName, fetchSingleUser, fetchUsers } from '../features/admin/adminSlice'
import { fetchCompetitiveAnalysis } from '../features/activesPassives/competitiveAnalysis/competitiveAnalysisSlice'
import {
	fetchCaaManual,
	fetchCorrAccountsAnalyze
} from '../features/dealingOperations/corrAccountsAnalyze/corrAccountsAnalyzeSlice'
import { fetchCorrOperations } from '../features/dealingOperations/corrOperations/corrOperationsSlice'
import { fetchFilialCp } from '../features/dealingOperations/filialCp/filialCpSlice'
import { fetchIncomeAnalysis } from '../features/keyIndicators/incomeAnalysis/incomeAnalysisSlice'

const actions = {
	...operDaysActions,
	getOperDays,
	getDashBoardLastUpdate,
	...dashboardActions,
	fetchDashboard,
	fetchDashboardCreditData,
	fetchMainIndicators,
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
	fetchIncomeAnalysis,
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
	fetchCompetitiveAnalysis,
	fetchCorrAccountsAnalyze,
	fetchCaaManual,
	fetchCorrOperations,
	fetchFilialCp,
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
