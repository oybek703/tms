import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'

const initialState = {
	loading: false,
	reportLiabilities: [],
	error: undefined
}

export const fetchReportLiabilities = checkCacheOrFetch(APIRoutes.reportLiabilities)

const reportLiabilitiesSlice = createSlice({
	name: APIRoutes.reportLiabilities,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchReportLiabilities.pending, state => {
			state.loading = true
			state.error = undefined
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
