import { combineReducers } from '@reduxjs/toolkit'
import { operDaysReducer } from '../features/operDays/operDaysSlice'
import { dashboardReducer } from '../features/Analytics/dashboard/dashboardSlice'
import { mainIndicatorsReducer } from '../features/Treasury/mainIndicators/mainIndicatorsSlice'
import { fcrbReducer } from '../features/Analytics/fcrb/fcrbSlice'
import { calcForReducer } from '../features/Treasury/calcFor/calcForSlice'
import { capitalReducer } from '../features/Treasury/capital/capitalSlice'
import { profitAndLostReducer } from '../features/Treasury/profitAndLost/profitAndLostSlice'
import { liquidityReducer } from '../features/Treasury/liquidity/liquiditySlice'
import { correspondentReducer } from '../features/Treasury/correspondent/correspondentSlice'
import { currencyPositionReducer } from '../features/Treasury/currencyPosition/currencyPositionSlice'
import { dashboardMonthlyReducer } from '../features/Analytics/dashboardMonthly/dashboardMonthlySlice'
import { creditDataReducer } from '../features/Treasury/creditData/creditDataSlice'
import { nostroMatrixReducer } from '../features/Analytics/nostroMatrix/nostroMatrixSlice'
import { vlaBufferReducer } from '../features/Analytics/vlaBuffer/vlaBufferSlice'
import { platReducer } from '../features/Treasury/plat/platSlice'
import { interbankDepositsReducer } from '../features/Treasury/interbankDeposits/interbankDepositsSlice'
import { topDepositsReducer } from '../features/Treasury/topDeposits/topDepositsSlice'
import { timeDepoClientsReducer } from '../features/Treasury/timeDepoClients/timeDepoClientsSlice'
import { timeDepositsReducer } from '../features/Treasury/timeDeposits/timeDepositsSlice'
import { depositsByDeadlineReducer } from '../features/Analytics/depositsByDeadline/depositsByDeadlineSlice'
import { reportLiabilitiesReducer } from '../features/Analytics/reportLiabilities/reportLiabilitiesSlice'
import { filialEffectivenessReducer } from '../features/Analytics/filialEffectiveness/filialEffectivenessSlice'
import { GMReducer } from '../features/Treasury/gm/gmSlice'
import { gapReducer } from '../features/Analytics/gap/gapSlice'
import { adminReducer } from '../features/admin/adminSlice'
import { authReducer } from '../features/auth/authSlice'
import { competitiveAnalysisReducer } from '../features/Analytics/competitiveAnalysis/competitiveAnalysisSlice'

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
	gap: gapReducer,
	admin: adminReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
