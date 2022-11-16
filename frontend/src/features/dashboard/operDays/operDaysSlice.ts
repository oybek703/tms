import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { getErrorMessage } from '../../../utils'

const initialState = {
	reportDate: localStorage.getItem('reportDate') || new Date().toISOString().slice(0, 10),
	operDaysLoading: false,
	operDaysError: undefined,
	operDays: [],
	lastUpdateLoading: false,
	lastUpdateError: undefined,
	lastUpdate: null
}

export const getOperDays = createAsyncThunk('operDays', async function (_, thunkAPI) {
	try {
		const {
			data: { dates }
		} = await axios.get(`/api/operDays`)
		return dates
	} catch (e) {
		const message = getErrorMessage(e)
		return thunkAPI.rejectWithValue(message)
	}
})

export const getDashBoardLastUpdate = createAsyncThunk('dashboardLastUpdate', async function (_, thunkAPI) {
	try {
		const {
			data: { lastUpdate }
		} = await axios.get(`/api/dashboard/lastUpdate`)
		return lastUpdate
	} catch (e) {
		const message = getErrorMessage(e)
		return thunkAPI.rejectWithValue(message)
	}
})

const operDaysSlice = createSlice({
	name: 'operDays',
	initialState,
	reducers: {
		changeReportDate: (state, action) => {
			localStorage.setItem('reportDate', action.payload)
			state.reportDate = action.payload
		}
	},
	extraReducers: builder => {
		builder.addCase(getOperDays.pending, state => {
			state.operDaysLoading = true
			state.operDaysError = undefined
		})
		builder.addCase(getOperDays.fulfilled, (state, action: PayloadAction<any>) => {
			state.operDays = action.payload
			state.operDaysLoading = false
		})
		builder.addCase(getOperDays.rejected, (state, action: PayloadAction<any>) => {
			state.operDaysLoading = false
			state.operDaysError = action.payload
		})
		builder.addCase(getDashBoardLastUpdate.pending, state => {
			state.lastUpdateLoading = true
			state.lastUpdateError = undefined
		})
		builder.addCase(getDashBoardLastUpdate.fulfilled, (state, action: PayloadAction<any>) => {
			state.lastUpdateLoading = false
			state.lastUpdate = action.payload
		})
		builder.addCase(getDashBoardLastUpdate.rejected, (state, action: PayloadAction<any>) => {
			state.lastUpdateLoading = false
			state.lastUpdateError = action.payload
		})
	}
})

export const operDaysActions = operDaysSlice.actions
export const operDaysReducer = operDaysSlice.reducer
