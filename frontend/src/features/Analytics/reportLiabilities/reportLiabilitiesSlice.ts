import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axios-utils'
import { APIRoutes } from '../../../interfaces/api-routes.interface'

const initialState = {
	loading: false,
	reportLiabilities: [],
	error: null
}

export const fetchReportLiabilities = checkCacheOrFetch(APIRoutes.reportLiabilities)

const reportLiabilitiesSlice = createSlice({
	name: APIRoutes.reportLiabilities,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchReportLiabilities.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchReportLiabilities.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.reportLiabilities = action.payload
		})
		builder.addCase(fetchReportLiabilities.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const reportLiabilitiesActions = reportLiabilitiesSlice.actions
export const reportLiabilitiesReducer = reportLiabilitiesSlice.reducer
