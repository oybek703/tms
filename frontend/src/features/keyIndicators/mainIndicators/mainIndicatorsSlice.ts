import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'

const initialState = {
	loading: false,
	mainIndicators: [],
	error: undefined
}

export const fetchMainIndicators = checkCacheOrFetch(APIRoutes.mainIndicators)

const mainIndicatorsSlice = createSlice({
	name: APIRoutes.mainIndicators,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchMainIndicators.pending, state => {
			state.loading = true
			state.error = undefined
		})
		builder.addCase(fetchMainIndicators.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.mainIndicators = action.payload
		})
		builder.addCase(fetchMainIndicators.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const mainIndicatorsActions = mainIndicatorsSlice.actions
export const mainIndicatorsReducer = mainIndicatorsSlice.reducer
