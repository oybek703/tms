import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { withToken } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'
import { ICorrOperations } from '../../../interfaces/corrOperations.interfaces'
import axios from 'axios'
import { getErrorMessage } from '../../../utils'
import { IFilialCpRow } from '../../../interfaces/filialCp.interfaces'

interface CAAInitialState {
	loading: boolean
	filialCp: IFilialCpRow[]
	error: undefined
}

const initialState: CAAInitialState = {
	loading: false,
	filialCp: [],
	error: undefined
}

interface ITwoDatesOption {
	firstDate: string
	secondDate: string
	currencyCode: string
}

const prefix = 'filialCP'

export const fetchFilialCp = createAsyncThunk(prefix, async (options: ITwoDatesOption, thunkApi) => {
	try {
		const { data } = await axios.get(`/api/${APIRoutes.filialCp}`, {
			...withToken(),
			params: options
		})
		return data
	} catch (e) {
		const message = getErrorMessage(e)
		return thunkApi.rejectWithValue(message)
	}
})

const filialCpSlice = createSlice({
	name: APIRoutes.filialCp,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchFilialCp.pending, state => {
			state.loading = true
			state.error = undefined
		})
		builder.addCase(fetchFilialCp.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.filialCp = action.payload
		})
		builder.addCase(fetchFilialCp.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const filialCpActions = filialCpSlice.actions
export const filialCpActionsReducer = filialCpSlice.reducer
