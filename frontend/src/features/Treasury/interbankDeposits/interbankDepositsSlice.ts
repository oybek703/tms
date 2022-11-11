import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axios-utils'
import { APIRoutes } from '../../../interfaces/api-routes.interface'

const initialState = {
	loading: false,
	interbankDeposits: {
		land: [],
		borrow: [],
		fullBorrowData: [],
		fullLandData: []
	},
	error: null
}

export const fetchInterbankDeposits = checkCacheOrFetch(APIRoutes.interbankDeposits)

const interbankDepositsSlice = createSlice({
	name: APIRoutes.interbankDeposits,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchInterbankDeposits.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchInterbankDeposits.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.interbankDeposits = action.payload
		})
		builder.addCase(fetchInterbankDeposits.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const interbankDepositsActions = interbankDepositsSlice.actions
export const interbankDepositsReducer = interbankDepositsSlice.reducer
