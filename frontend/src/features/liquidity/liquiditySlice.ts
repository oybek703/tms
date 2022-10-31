import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch, fetchWithoutCache } from '../../utils/axiosUtils'
import { APIRoutes } from '../../interfaces/apiRoutes.interface'

const initialState = {
	loading: false,
	liquidity: {
		liquidityAssets: [],
		obligations: []
	},
	error: null,
	currentState: false,
	currentLiquidityLoading: false,
	currentLiquidity: {
		liquidityAssets: [],
		obligations: []
	},
	currentLiquidityError: undefined
}

const prefix = 'liquidityCurrent'
export const fetchLiquidity = checkCacheOrFetch(APIRoutes.liquidity)
export const fetchLiquidityCurrent = fetchWithoutCache(prefix, APIRoutes.liquidityCurrent as unknown as typeof prefix)

const liquiditySlice = createSlice({
	name: APIRoutes.liquidity,
	initialState,
	reducers: {
		changeLiquidityCurrenState(state, action: PayloadAction<boolean>) {
			state.currentState = action.payload
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchLiquidity.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchLiquidity.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.liquidity = action.payload
		})
		builder.addCase(fetchLiquidity.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
		builder.addCase(fetchLiquidityCurrent.pending, state => {
			state.currentLiquidityLoading = true
		})
		builder.addCase(fetchLiquidityCurrent.fulfilled, (state, action: PayloadAction<any>) => {
			state.currentLiquidityLoading = false
			state.currentLiquidity = action.payload
		})
		builder.addCase(fetchLiquidityCurrent.rejected, (state, action: PayloadAction<any>) => {
			state.currentLiquidityLoading = false
			state.currentLiquidityError = action.payload
		})
	}
})

export const liquidityActions = liquiditySlice.actions
export const liquidityReducer = liquiditySlice.reducer
