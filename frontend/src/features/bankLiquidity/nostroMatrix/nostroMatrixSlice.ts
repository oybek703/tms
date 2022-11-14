import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getErrorMessage } from '../../../utils'
import axios from 'axios'
import { withToken } from '../../../utils/axiosUtils'

const initialState = {
	loading: false,
	nostroMatrix: [],
	error: undefined
}

interface NostroMatrixOptions {
	firstDate: string
	secondDate: string
}

const prefix = 'nostroMatrix'
export const fetchNostroMatrix = createAsyncThunk(prefix, async (options: NostroMatrixOptions, thunkApi) => {
	try {
		const { data } = await axios.get(
			`/api/nostroMatrix?firstDate=${options.firstDate}&secondDate=${options.secondDate}`,
			withToken()
		)
		return data
	} catch (e) {
		const message = getErrorMessage(e)
		return thunkApi.rejectWithValue(message)
	}
})

const nostroMatrixSlice = createSlice({
	name: prefix,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchNostroMatrix.pending, state => {
			state.loading = true
		})
		builder.addCase(fetchNostroMatrix.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.nostroMatrix = action.payload
		})
		builder.addCase(fetchNostroMatrix.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const nostroMatrixActions = nostroMatrixSlice.actions
export const nostroMatrixReducer = nostroMatrixSlice.reducer
