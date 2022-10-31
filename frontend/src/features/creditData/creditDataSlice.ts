import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../utils/axiosUtils'
import { APIRoutes } from '../../interfaces/apiRoutes.interface'

const initialState = {
	loading: false,
	creditData: {
		creditPart: [],
		disaggregatedByTime: [],
		issuedCredits: []
	},
	error: undefined
}

export const fetchDashboardCreditData = checkCacheOrFetch(APIRoutes.creditData)

const creditDataSlice = createSlice({
	name: APIRoutes.creditData,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchDashboardCreditData.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchDashboardCreditData.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.creditData = action.payload
		})
		builder.addCase(fetchDashboardCreditData.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const creditDataActions = creditDataSlice.actions
export const creditDataReducer = creditDataSlice.reducer
