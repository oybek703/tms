import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'

const initialState = {
	loading: false,
	plat: {
		involvedFunds: [],
		placedFunds: []
	},
	error: undefined
}

export const fetchPlat = checkCacheOrFetch(APIRoutes.placedAttracted)

const platSlice = createSlice({
	name: APIRoutes.placedAttracted,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchPlat.pending, state => {
			state.loading = true
			state.error = undefined
		})
		builder.addCase(fetchPlat.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.plat = action.payload
		})
		builder.addCase(fetchPlat.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const platActions = platSlice.actions
export const platReducer = platSlice.reducer
