import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axios-utils'
import { APIRoutes } from '../../../interfaces/api-routes.interface'

const initialState = {
	loading: false,
	currencyPosition: {
		allRows: [],
		tableSumData: []
	},
	error: null
}

export const fetchCurrencyPosition = checkCacheOrFetch(APIRoutes.currencyPosition)

const currencyPositionSlice = createSlice({
	name: APIRoutes.currencyPosition,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchCurrencyPosition.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchCurrencyPosition.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.currencyPosition = action.payload
		})
		builder.addCase(fetchCurrencyPosition.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const currencyPositionActions = currencyPositionSlice.actions
export const currencyPositionReducer = currencyPositionSlice.reducer
