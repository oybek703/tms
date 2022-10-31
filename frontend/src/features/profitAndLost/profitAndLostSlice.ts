import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../utils/axiosUtils'
import { APIRoutes } from '../../interfaces/apiRoutes.interface'

const initialState = {
	loading: false,
	profitAndLost: [],
	error: null
}

export const fetchProfitAndLost = checkCacheOrFetch(APIRoutes.profitAndLost)

const profitAndLostSlice = createSlice({
	name: APIRoutes.profitAndLost,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchProfitAndLost.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchProfitAndLost.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.profitAndLost = action.payload
		})
		builder.addCase(fetchProfitAndLost.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const profitAndLostActions = profitAndLostSlice.actions
export const profitAndLostReducer = profitAndLostSlice.reducer
