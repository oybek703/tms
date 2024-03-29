import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'

const initialState = {
	loading: false,
	currencyPosition: {
		allRows: [],
		tableSumData: []
	},
	error: undefined
}

export const fetchCurrencyPosition = checkCacheOrFetch(APIRoutes.currencyPosition)

const currencyPositionSlice = createSlice({
	name: APIRoutes.currencyPosition,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchCurrencyPosition.pending, state => {
			state.loading = true
			state.error = undefined
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
