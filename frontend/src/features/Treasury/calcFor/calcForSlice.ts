import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axios-utils'
import { APIRoutes } from '../../../interfaces/api-routes.interface'

const initialState = {
	loading: false,
	calcFor: [],
	error: null
}

export const fetchCalcFor = checkCacheOrFetch(APIRoutes.calcFor)

const calcForSlice = createSlice({
	name: APIRoutes.fcrb,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchCalcFor.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchCalcFor.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.calcFor = action.payload
		})
		builder.addCase(fetchCalcFor.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const calcForActions = calcForSlice.actions
export const calcForReducer = calcForSlice.reducer
