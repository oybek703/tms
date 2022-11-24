import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchWithoutCache } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'
import { CAAChangeHistory, ICorrAccountsAnalyze } from '../../../interfaces/caa.interfaces'

interface CAAInitialState {
	loading: boolean
	corrAccountsAnalyze: ICorrAccountsAnalyze[]
	error: undefined
	manualLoading: boolean
	caaManual: {
		corrAccountsAnalyze: ICorrAccountsAnalyze[]
		caaUpdateHistory: CAAChangeHistory[]
	}
	manualError: undefined
}

const initialState: CAAInitialState = {
	loading: false,
	corrAccountsAnalyze: [],
	error: undefined,
	manualLoading: false,
	caaManual: {
		corrAccountsAnalyze: [],
		caaUpdateHistory: []
	},
	manualError: undefined
}

const prefix = 'corrAccountsAnalyze'
const manualPrefix = 'caaManual'

export const fetchCorrAccountsAnalyze = fetchWithoutCache(
	prefix,
	APIRoutes.corrAccountsAnalyze as unknown as typeof prefix
)

export const fetchCaaManual = fetchWithoutCache(manualPrefix, APIRoutes.caaManual as unknown as typeof manualPrefix)

const corrAccountsAnalyzeSlice = createSlice({
	name: APIRoutes.corrAccountsAnalyze,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchCorrAccountsAnalyze.pending, state => {
			state.loading = true
			state.error = undefined
		})
		builder.addCase(fetchCorrAccountsAnalyze.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.corrAccountsAnalyze = action.payload
		})
		builder.addCase(fetchCorrAccountsAnalyze.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
		builder.addCase(fetchCaaManual.pending, state => {
			state.manualLoading = true
			state.manualError = undefined
		})
		builder.addCase(fetchCaaManual.fulfilled, (state, action: PayloadAction<any>) => {
			state.manualLoading = false
			state.caaManual = action.payload
		})
		builder.addCase(fetchCaaManual.rejected, (state, action: PayloadAction<any>) => {
			state.manualLoading = false
			state.manualError = action.payload
		})
	}
})

export const corrAccountsAnalyzeActions = corrAccountsAnalyzeSlice.actions
export const corrAccountsAnalyzeReducer = corrAccountsAnalyzeSlice.reducer
