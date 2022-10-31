import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchWithoutCache, withToken } from '../../utils/axiosUtils'
import { APIRoutes } from '../../interfaces/apiRoutes.interface'
import { getErrorMessage } from '../../utils'
import axios from 'axios'

const initialState = {
	loading: false,
	gap: {
		months: [],
		sourceOfLiquidity: [],
		sourceOfLiquidityTotal: [],
		needsOfLiquidity: [],
		needsOfLiquidityTotal: [],
		vlaLcrData: []
	},
	error: undefined,
	lastUpdateLoading: false,
	lastUpdateError: undefined,
	lastUpdate: undefined,
	gapSimulation: {
		months: [],
		sourceOfLiquidity: [],
		sourceOfLiquidityTotal: [],
		needsOfLiquidity: [],
		needsOfLiquidityTotal: [],
		vlaLcrData: []
	},
	gapSimulationLoading: false,
	gapSimulationError: undefined
}

const prefix = 'gap'
const lastUpdatePrefix = `${prefix}/lastUpdate`
const gapSimulationPrefix = `${prefix}/simulation`

export const fetchGap = fetchWithoutCache(prefix, APIRoutes.gap as unknown as typeof prefix)
export const fetchLastGapUpdateTime = fetchWithoutCache(
	lastUpdatePrefix,
	APIRoutes.gapLastUpdate as unknown as typeof prefix
)
export const fetchGapSimulation = createAsyncThunk(
	gapSimulationPrefix,
	async (options: { forEditing?: boolean } | undefined, thunkAPI) => {
		const forEditing = (options && options.forEditing) ?? false
		try {
			const {
				data: { data }
			} = await axios.get(`${APIRoutes.gapSimulation}?forEditing=${forEditing}`, withToken())
			return data
		} catch (e) {
			const message = getErrorMessage(e)
			return thunkAPI.rejectWithValue(message)
		}
	}
)

const gapSlice = createSlice({
	name: prefix,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchGap.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchGap.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.gap = action.payload
		})
		builder.addCase(fetchGap.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
		builder.addCase(fetchLastGapUpdateTime.pending, state => {
			state.lastUpdateLoading = true
		})
		builder.addCase(fetchLastGapUpdateTime.fulfilled, (state, action: PayloadAction<any>) => {
			state.lastUpdateLoading = false
			const [{ lastGapUpdate }] = action.payload
			state.lastUpdate = lastGapUpdate
		})
		builder.addCase(fetchLastGapUpdateTime.rejected, (state, action: PayloadAction<any>) => {
			state.lastUpdateLoading = false
			state.lastUpdateError = action.payload
		})
		builder.addCase(fetchGapSimulation.pending, state => {
			state.gapSimulationLoading = true
		})
		builder.addCase(fetchGapSimulation.fulfilled, (state, action: PayloadAction<any>) => {
			state.gapSimulationLoading = false
			state.gapSimulation = action.payload
		})
		builder.addCase(fetchGapSimulation.rejected, (state, action: PayloadAction<any>) => {
			state.gapSimulationLoading = false
			state.gapSimulationError = action.payload
		})
	}
})

export const gapActions = gapSlice.actions
export const gapReducer = gapSlice.reducer
