import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'
import { ICompetitiveAnalysis } from '../../../interfaces/ca.interface'

interface IInitialState {
	loading: boolean
	competitiveAnalysis: ICompetitiveAnalysis
	error: undefined
}

const initialState: IInitialState = {
	loading: false,
	competitiveAnalysis: {
		quarterDates: [],
		totalData: {},
		chartData: {
			creditPortfolioGrow: [0, 0, 0, 0],
			depositGrow: [0, 0, 0, 0]
		}
	},
	error: undefined
}

export const fetchCompetitiveAnalysis = checkCacheOrFetch(APIRoutes.competitiveAnalysis)

const competitiveAnalysisSlice = createSlice({
	name: APIRoutes.competitiveAnalysis,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchCompetitiveAnalysis.pending, state => {
			state.loading = true
			state.error = undefined
		})
		builder.addCase(fetchCompetitiveAnalysis.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.competitiveAnalysis = action.payload
		})
		builder.addCase(fetchCompetitiveAnalysis.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const competitiveAnalysisActions = competitiveAnalysisSlice.actions
export const competitiveAnalysisReducer = competitiveAnalysisSlice.reducer
