import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../utils/axiosUtils'
import { APIRoutes } from '../../interfaces/apiRoutes.interface'

const initialState = {
	loading: false,
	fcrb: [],
	error: null
}

export const fetchFcrb = checkCacheOrFetch(APIRoutes.fcrb)

const fcrbSlice = createSlice({
	name: APIRoutes.fcrb,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchFcrb.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchFcrb.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.fcrb = action.payload
		})
		builder.addCase(fetchFcrb.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const fcrbActions = fcrbSlice.actions
export const fcrbReducer = fcrbSlice.reducer
