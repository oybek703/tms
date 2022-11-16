import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'

const initialState = {
	loading: false,
	interbankDeposits: {
		land: [],
		borrow: [],
		fullBorrowData: [],
		fullLandData: []
	},
	error: undefined
}

export const fetchInterbankDeposits = checkCacheOrFetch(APIRoutes.interbankDeposits)

const interbankDepositsSlice = createSlice({
	name: APIRoutes.interbankDeposits,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchInterbankDeposits.pending, state => {
			state.loading = true
			state.error = undefined
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
