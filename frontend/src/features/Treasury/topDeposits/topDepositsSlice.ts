import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axios-utils'
import { APIRoutes } from '../../../interfaces/api-routes.interface'

const initialState = {
	loading: false,
	topDeposits: {},
	error: undefined
}

export const fetchTopDeposits = checkCacheOrFetch(APIRoutes.topDeposits)

const topDepositsSlice = createSlice({
	name: APIRoutes.topDeposits,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchTopDeposits.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchTopDeposits.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.topDeposits = action.payload
		})
		builder.addCase(fetchTopDeposits.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const topDepositsActions = topDepositsSlice.actions
export const topDepositsReducer = topDepositsSlice.reducer
