import { combineReducers } from '@reduxjs/toolkit'
import { operDaysReducer } from '../features/dashboard/operDays/operDaysSlice'
import { dashboardReducer } from '../features/dashboard/dashboard/dashboardSlice'
import { mainIndicatorsReducer } from '../features/keyIndicators/mainIndicators/mainIndicatorsSlice'
import { fcrbReducer } from '../features/dashboard/fcrb/fcrbSlice'
import { calcForReducer } from '../features/bankLiquidity/calcFor/calcForSlice'
import { capitalReducer } from '../features/keyIndicators/capital/capitalSlice'
import { profitAndLostReducer } from '../features/keyIndicators/profitAndLost/profitAndLostSlice'
import { liquidityReducer } from '../features/bankLiquidity/liquidity/liquiditySlice'
import { correspondentReducer } from '../features/bankLiquidity/correspondent/correspondentSlice'
import { currencyPositionReducer } from '../features/bankLiquidity/currencyPosition/currencyPositionSlice'
import { dashboardMonthlyReducer } from '../features/dashboard/dashboardMonthly/dashboardMonthlySlice'
import { creditDataReducer } from '../features/dashboard/creditData/creditDataSlice'
import { nostroMatrixReducer } from '../features/bankLiquidity/nostroMatrix/nostroMatrixSlice'
import { vlaBufferReducer } from '../features/bankLiquidity/vlaBuffer/vlaBufferSlice'
import { platReducer } from '../features/activesPassives/plat/platSlice'
import { interbankDepositsReducer } from '../features/activesPassives/interbankDeposits/interbankDepositsSlice'
import { topDepositsReducer } from '../features/activesPassives/topDeposits/topDepositsSlice'
import { timeDepoClientsReducer } from '../features/activesPassives/timeDepoClients/timeDepoClientsSlice'
import { timeDepositsReducer } from '../features/activesPassives/timeDeposits/timeDepositsSlice'
import { depositsByDeadlineReducer } from '../features/activesPassives/depositsByDeadline/depositsByDeadlineSlice'
import { reportLiabilitiesReducer } from '../features/activesPassives/reportLiabilities/reportLiabilitiesSlice'
import { filialEffectivenessReducer } from '../features/activesPassives/filialEffectiveness/filialEffectivenessSlice'
import { GMReducer } from '../features/activesPassives/gm/gmSlice'
import { gapReducer } from '../features/gap/gapSlice'
import { adminReducer } from '../features/admin/adminSlice'
import { authReducer } from '../features/auth/authSlice'
import { competitiveAnalysisReducer } from '../features/activesPassives/competitiveAnalysis/competitiveAnalysisSlice'
import { corrAccountsAnalyzeReducer } from '../features/dealingOperations/corrAccountsAnalyze/corrAccountsAnalyzeSlice'
import { corrOperationsActionsReducer } from '../features/dealingOperations/corrOperations/corrOperationsSlice'

const rootReducer = combineReducers({
	auth: authReducer,
	operDays: operDaysReducer,
	dashboard: dashboardReducer,
	mainIndicators: mainIndicatorsReducer,
	dashboardMonthly: dashboardMonthlyReducer,
	profitAndLost: profitAndLostReducer,
	capital: capitalReducer,
	liquidity: liquidityReducer,
	correspondent: correspondentReducer,
	currencyPosition: currencyPositionReducer,
	calcFor: calcForReducer,
	interbankDeposits: interbankDepositsReducer,
	plat: platReducer,
	topDeposits: topDepositsReducer,
	timeDepoClients: timeDepoClientsReducer,
	timeDeposits: timeDepositsReducer,
	depositsByDeadline: depositsByDeadlineReducer,
	gm: GMReducer,
	reportLiabilities: reportLiabilitiesReducer,
	fcrb: fcrbReducer,
	creditData: creditDataReducer,
	nostroMatrix: nostroMatrixReducer,
	vlaBuffer: vlaBufferReducer,
	filialEffectiveness: filialEffectivenessReducer,
	competitiveAnalysis: competitiveAnalysisReducer,
	corrAccountsAnalyze: corrAccountsAnalyzeReducer,
	corrOperations: corrOperationsActionsReducer,
	gap: gapReducer,
	admin: adminReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
