import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch, fetchWithoutCache, withToken } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'
import { IFlowsRow, IVlaAndForRow } from '../../../interfaces/vlaAndFor.interfaces'
import axios from 'axios'
import { getErrorMessage } from '../../../utils'
import { RootState } from '../../../app/rootReducer'

interface IVlaBufferInitialState {
	loading: boolean
	vlaAndFor: {
		liquidityAssets: IVlaAndForRow[]
		inFlow: IFlowsRow[]
		outFlow: IFlowsRow[]
	}
	error: undefined
}

const initialState: IVlaBufferInitialState = {
	loading: false,
	vlaAndFor: {
		liquidityAssets: [],
		inFlow: [],
		outFlow: []
	},
	error: undefined
}

const prefix = 'vlaAndFor'

export const fetchVlaAndFor = createAsyncThunk(prefix, async (_: undefined, thunkApi) => {
	try {
		const { operDays } = thunkApi.getState() as RootState
		const { reportDate } = operDays
		const { data } = await axios.get(`${APIRoutes.vlaAndFor}?date=${reportDate}`, withToken())
		return data
	} catch (e) {
		const message = getErrorMessage(e)
		return thunkApi.rejectWithValue(message)
	}
})

const vlaAndForSlice = createSlice({
	name: prefix,
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
