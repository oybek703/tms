import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axios-utils'
import { APIRoutes } from '../../../interfaces/api-routes.interface'

const initialState = {
	loading: false,
	timeDepoClients: [],
	error: undefined
}

export const fetchTimeDepoClients = checkCacheOrFetch(APIRoutes.timeDepoClients)

const timeDepoClientsSlice = createSlice({
	name: APIRoutes.timeDepoClients,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchTimeDepoClients.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchTimeDepoClients.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.timeDepoClients = action.payload
		})
		builder.addCase(fetchTimeDepoClients.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const timeDepoClientsActions = timeDepoClientsSlice.actions
export const timeDepoClientsReducer = timeDepoClientsSlice.reducer
