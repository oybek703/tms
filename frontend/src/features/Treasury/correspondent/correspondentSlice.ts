import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch, fetchWithoutCache } from '../../../utils/axios-utils'
import { APIRoutes } from '../../../interfaces/api-routes.interface'

const initialState = {
	loading: false,
	correspondent: {
		currencyRate: [],
		totalCash: [],
		interbankDeposits: []
	},
	error: null,
	currentState: false,
	currentCorrespondentLoading: false,
	currentCorrespondent: {
		currencyRate: [],
		totalCash: [],
		interbankDeposits: []
	},
	currentCorrespondentError: undefined
}

const prefix = 'correspondentCurrent'
export const fetchCorrespondent = checkCacheOrFetch(APIRoutes.correspondent)
export const fetchCorrespondentCurrent = fetchWithoutCache(
	prefix,
	APIRoutes.correspondentCurrent as unknown as typeof prefix
)

const correspondentSlice = createSlice({
	name: APIRoutes.correspondent,
	initialState,
	reducers: {
		changeCorrespondentCurrenState(state, action: PayloadAction<boolean>) {
			state.currentState = action.payload
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchCorrespondent.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchCorrespondent.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.correspondent = action.payload
		})
		builder.addCase(fetchCorrespondent.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
		builder.addCase(fetchCorrespondentCurrent.pending, state => {
			state.currentCorrespondentLoading = true
		})
		builder.addCase(fetchCorrespondentCurrent.fulfilled, (state, action: PayloadAction<any>) => {
			state.currentCorrespondentLoading = false
			state.currentCorrespondent = action.payload
		})
		builder.addCase(fetchCorrespondentCurrent.rejected, (state, action: PayloadAction<any>) => {
			state.currentCorrespondentLoading = false
			state.currentCorrespondentError = action.payload
		})
	}
})

export const correspondentActions = correspondentSlice.actions
export const correspondentReducer = correspondentSlice.reducer
