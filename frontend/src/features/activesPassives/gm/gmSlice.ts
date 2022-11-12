import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'

const initialState = {
	loading: false,
	gm: {
		tableData: [],
		accredetiv: {},
		currRates: []
	},
	error: null
}

export const fetchGM = checkCacheOrFetch(APIRoutes.gm)

const gmSlice = createSlice({
	name: APIRoutes.gm,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchGM.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchGM.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.gm = action.payload
		})
		builder.addCase(fetchGM.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const GMActions = gmSlice.actions
export const GMReducer = gmSlice.reducer
