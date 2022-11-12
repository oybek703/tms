import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'

const initialState = {
	loading: false,
	capital: [],
	error: null
}

export const fetchCapital = checkCacheOrFetch(APIRoutes.capital)

const capitalSlice = createSlice({
	name: APIRoutes.capital,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchCapital.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchCapital.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.capital = action.payload
		})
		builder.addCase(fetchCapital.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const capitalActions = capitalSlice.actions
export const capitalReducer = capitalSlice.reducer
