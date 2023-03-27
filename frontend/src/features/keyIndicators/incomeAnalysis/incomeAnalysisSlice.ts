import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'
import { IIncomeData } from '../../../interfaces/incomeAnalysis.interfaces'

interface IIncomeAnalysisInitialState {
	loading: boolean
	incomeAnalysis: {
		income: IIncomeData[]
		incomeNoPercent: IIncomeData[]
		consumption: IIncomeData[]
		consumptionNoPercent: IIncomeData[]
	}
	error: undefined
}

const initialState: IIncomeAnalysisInitialState = {
	loading: false,
	incomeAnalysis: {
		income: [],
		incomeNoPercent: [],
		consumption: [],
		consumptionNoPercent: []
	},
	error: undefined
}

export const fetchIncomeAnalysis = checkCacheOrFetch(APIRoutes.incomeAnalysis)

const incomeAnalysisSlice = createSlice({
	name: APIRoutes.capital,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchIncomeAnalysis.pending, state => {
			state.loading = true
			state.error = undefined
		})
		builder.addCase(fetchIncomeAnalysis.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.incomeAnalysis = action.payload
		})
		builder.addCase(fetchIncomeAnalysis.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const incomeAnalysisActions = incomeAnalysisSlice.actions
export const incomeAnalysisReducer = incomeAnalysisSlice.reducer
