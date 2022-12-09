import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { withToken } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'
import { ICorrOperations } from '../../../interfaces/corr-operations.interfaces'
import axios from 'axios'
import { getErrorMessage } from '../../../utils'

interface CAAInitialState {
	loading: boolean
	corrOperations: ICorrOperations
	error: undefined
}

const initialState: CAAInitialState = {
	loading: false,
	corrOperations: {
		bankList: [],
		volume: [],
		fx: [],
		physicalPayments: [],
		legalPayments: [],
		interbankOperations: [],
		loroAccountsOperations: [],
		accredetivOperations: []
	},
	error: undefined
}

interface ITwoDatesOption {
	firstDate: string
	secondDate: string
	currencyCode: string
	clientCode?: string | null
}

const prefix = 'corrOperations'

export const fetchCorrOperations = createAsyncThunk(prefix, async (options: ITwoDatesOption, thunkApi) => {
	try {
		const { data } = await axios.get(`/api/${APIRoutes.corrOperations}`, {
			...withToken(),
			params: options
		})
		return data
	} catch (e) {
		const message = getErrorMessage(e)
		return thunkApi.rejectWithValue(message)
	}
})

const corrOperationsSlice = createSlice({
	name: APIRoutes.corrOperations,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchCorrOperations.pending, state => {
			state.loading = true
			state.error = undefined
		})
		builder.addCase(fetchCorrOperations.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.corrOperations = action.payload
		})
		builder.addCase(fetchCorrOperations.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const corrOperationsActions = corrOperationsSlice.actions
export const corrOperationsActionsReducer = corrOperationsSlice.reducer
