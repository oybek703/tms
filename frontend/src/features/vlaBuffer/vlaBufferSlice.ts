import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../utils/axiosUtils'
import { APIRoutes } from '../../interfaces/apiRoutes.interface'

const initialState = {
	loading: false,
	vlaBuffer: {},
	error: undefined
}

export const fetchVlaBuffer = checkCacheOrFetch(APIRoutes.vlaBuffer)

const vlaBufferSlice = createSlice({
	name: APIRoutes.vlaBuffer,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchVlaBuffer.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchVlaBuffer.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.vlaBuffer = action.payload
		})
		builder.addCase(fetchVlaBuffer.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const vlaBufferActions = vlaBufferSlice.actions
export const vlaBufferReducer = vlaBufferSlice.reducer
