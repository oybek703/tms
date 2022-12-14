import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getErrorMessage } from '../../../utils'
import axios from 'axios'
import { withToken } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'

interface RowData {
	code: string
	title: string
	data: {
		name: string
		moreOperations: string
		quick: string
		safe: string
		expensiveOrCheap: string
		saldoOut: number
		turnoverDebit: number
		percentDebit: number
		turnoverCredit: number
		percentCredit: number
		import: string
		export: string
		accredetiv: string
		interbankDeposit: string
		forex: string
		creditLine: string
		vostro: string
		useForPayment: string
	}[]
}
const initialState: { loading: boolean; error: undefined; nostroMatrix: RowData[] } = {
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
			`/api/${APIRoutes.nostroMatrix}?firstDate=${options.firstDate}&secondDate=${options.secondDate}`,
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
			state.error = undefined
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
