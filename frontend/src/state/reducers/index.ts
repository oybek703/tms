import { combineReducers } from '@reduxjs/toolkit'
import editUser from './Admin/editUserReducer'
import getUser from './Admin/getUserReducer'
import { operDaysReducer } from '../../features/operDays/operDaysSlice'
import { dashboardReducer } from '../../features/dashboard/dashboardSlice'
import { mainIndicatorsReducer } from '../../features/mainIndicators/mainIndicatorsSlice'
import { fcrbReducer } from '../../features/fcrb/fcrbSlice'
import { calcForReducer } from '../../features/calcFor/calcForSlice'
import { capitalReducer } from '../../features/capital/capitalSlice'
import { profitAndLostReducer } from '../../features/profitAndLost/profitAndLostSlice'
import { liquidityReducer } from '../../features/liquidity/liquiditySlice'
import { correspondentReducer } from '../../features/correspondent/correspondentSlice'
import { currencyPositionReducer } from '../../features/currencyPosition/currencyPositionSlice'
import { dashboardMonthlyReducer } from '../../features/dashboardMonthly/dashboardMonthlySlice'
import { creditDataReducer } from '../../features/creditData/creditDataSlice'
import { nostroMatrixReducer } from '../../features/nostroMatrix/nostroMatrixSlice'
import { vlaBufferReducer } from '../../features/vlaBuffer/vlaBufferSlice'
import { platReducer } from '../../features/plat/platSlice'
import { interbankDepositsReducer } from '../../features/interbankDeposits/interbankDepositsSlice'
import { topDepositsReducer } from '../../features/topDeposits/topDepositsSlice'
import { timeDepoClientsReducer } from '../../features/timeDepoClients/timeDepoClientsSlice'
import { timeDepositsReducer } from '../../features/timeDeposits/timeDepositsSlice'
import { depositsByDeadlineReducer } from '../../features/depositsByDeadline/depositsByDeadlineSlice'
import { reportLiabilitiesReducer } from '../../features/reportLiabilities/reportLiabilitiesSlice'
import { filialEffectivenessReducer } from '../../features/filialEffectiveness/filialEffectivenessSlice'
import { GMReducer } from '../../features/gm/gmSlice'
import { gapReducer } from '../../features/gap/gapSlice'
import { adminReducer } from '../../features/admin/adminSlice'
import { authReducer } from '../../features/auth/authSlice'

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
	gap: gapReducer,
	admin: adminReducer,
	getUser,
	editUser
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
