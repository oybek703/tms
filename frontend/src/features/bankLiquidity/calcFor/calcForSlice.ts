import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'
import { ICalcForData } from '../../../interfaces/calcFor.interfaces'

interface ICalcInitialState {
	loading: boolean
	calcFor: ICalcForData[]
	error: undefined
}

const initialState: ICalcInitialState = {
	loading: false,
	calcFor: [],
	error: undefined
}

export const fetchCalcFor = checkCacheOrFetch(APIRoutes.calcFor)

const calcForSlice = createSlice({
	name: APIRoutes.fcrb,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchCalcFor.pending, state => {
			state.loading = true
			state.error = undefined
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
