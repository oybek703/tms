import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'

const initialState = {
	loading: false,
	timeDeposits: {
		tableData: [],
		currentBalance: [],
		balanceInMonthBegin: []
	},
	error: undefined
}

export const fetchTimeDeposits = checkCacheOrFetch(APIRoutes.timeDeposits)

const timeDepositsSlice = createSlice({
	name: APIRoutes.timeDeposits,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchTimeDeposits.pending, state => {
			state.loading = true
			state.error = undefined
		})
		builder.addCase(fetchTimeDeposits.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.timeDeposits = action.payload
		})
		builder.addCase(fetchTimeDeposits.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const timeDepositsActions = timeDepositsSlice.actions
export const timeDepositsReducer = timeDepositsSlice.reducer
