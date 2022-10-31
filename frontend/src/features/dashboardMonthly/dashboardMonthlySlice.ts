import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getErrorMessage } from '../../utils'
import axios from 'axios'
import { withToken } from '../../utils/axiosUtils'

const initialState = {
	loading: false,
	dashboardMonthly: [],
	error: null
}

interface DashboardMonthlyOptions {
	firstDate: string
	secondDate: string
	dateOption: string
}

const prefix = 'dashboardMonthly'
export const fetchDashboardMonthly = createAsyncThunk(prefix, async (options: DashboardMonthlyOptions, thunkApi) => {
	try {
		const {
			data: { rows }
		} = await axios.get(
			`/api/dashboardMonthly?firstDate=${options.firstDate}&secondDate=${options.secondDate}&dateOption=${options.dateOption}`,
			withToken()
		)
		return rows
	} catch (e) {
		const message = getErrorMessage(e)
		return thunkApi.rejectWithValue(message)
	}
})

const dashboardMonthlySlice = createSlice({
	name: prefix,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchDashboardMonthly.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchDashboardMonthly.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.dashboardMonthly = action.payload
		})
		builder.addCase(fetchDashboardMonthly.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const dashboardMonthlyActions = dashboardMonthlySlice.actions
export const dashboardMonthlyReducer = dashboardMonthlySlice.reducer
