import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'

const initialState = {
	loading: false,
	dashboard: {
		dashboardCorrespondent: [],
		dashboardCurrencyPosition: [],
		timeDeposits: [],
		currencyMfi: [],
		currencyTimeDeposits: [],
		interbankDeposits: [],
		fundingStructure: [],
		currencyMBD: [],
		vla: {},
		lcr: {},
		nsfr: {},
		il: {},
		currencyRates: [],
		bankLimits: {}
	},
	error: undefined,
	activeTab: parseInt(localStorage.getItem('dashboardActiveTab') || '0')
}

export const fetchDashboard = checkCacheOrFetch(APIRoutes.dashboard)

const dashboardSlice = createSlice({
	name: APIRoutes.dashboard,
	initialState,
	reducers: {
		changeActiveTab(state, action: PayloadAction<string>) {
			localStorage.setItem('dashboardActiveTab', action.payload)
			state.activeTab = parseInt(action.payload)
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchDashboard.pending, state => {
			state.loading = true
			state.error = undefined
		})
		builder.addCase(fetchDashboard.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.dashboard = action.payload
		})
		builder.addCase(fetchDashboard.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const dashboardActions = dashboardSlice.actions
export const dashboardReducer = dashboardSlice.reducer
