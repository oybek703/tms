import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchWithoutCache } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'

const initialState = {
	loading: false,
	corrAccountsAnalyze: [],
	error: undefined
}

const prefix = 'corrAccountsAnalyze'

export const fetchCorrAccountsAnalyze = fetchWithoutCache(
	prefix,
	APIRoutes.corrAccountsAnalyze as unknown as typeof prefix
)

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
	}
})

export const corrAccountsAnalyzeActions = corrAccountsAnalyzeSlice.actions
export const corrAccountsAnalyzeReducer = corrAccountsAnalyzeSlice.reducer
