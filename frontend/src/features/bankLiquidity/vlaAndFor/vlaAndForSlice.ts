import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'
import { ILiquidityRow } from '../../../interfaces/liquidity.interfaces'

interface IVlaBufferInitialState {
	loading: boolean
	vlaAndFor: {
		liquidityAssets: ILiquidityRow[]
		activesCurrent: Pick<ILiquidityRow, 'total' | 'natCurr' | 'forCurr'>[]
	}
	error: undefined
}

const initialState: IVlaBufferInitialState = {
	loading: false,
	vlaAndFor: {
		liquidityAssets: [],
		activesCurrent: []
	},
	error: undefined
}

export const fetchVlaAndFor = checkCacheOrFetch(APIRoutes.vlaAndFor)

const vlaAndForSlice = createSlice({
	name: APIRoutes.vlaAndFor,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchVlaAndFor.pending, state => {
			state.loading = true
			state.error = undefined
		})
		builder.addCase(fetchVlaAndFor.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.vlaAndFor = action.payload
		})
		builder.addCase(fetchVlaAndFor.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const vlaAndForActions = vlaAndForSlice.actions
export const vlaAndForReducer = vlaAndForSlice.reducer
