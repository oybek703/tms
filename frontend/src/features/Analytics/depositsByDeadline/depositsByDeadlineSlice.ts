import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'

const initialState = {
	loading: false,
	depositsByDeadline: [],
	error: undefined
}

export const fetchDepositsByDeadline = checkCacheOrFetch(APIRoutes.depositsByDeadline)

const depositsByDeadlineSlice = createSlice({
	name: APIRoutes.depositsByDeadline,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchDepositsByDeadline.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchDepositsByDeadline.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.depositsByDeadline = action.payload
		})
		builder.addCase(fetchDepositsByDeadline.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const depositsByDeadlineActions = depositsByDeadlineSlice.actions
export const depositsByDeadlineReducer = depositsByDeadlineSlice.reducer
