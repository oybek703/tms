import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getErrorMessage } from '../../utils'
import axios from 'axios'

const initialState = {
	loading: false,
	error: null,
	user: JSON.parse(localStorage.getItem('user') || '{}')
}

export const login = createAsyncThunk('auth', async (options: { userName: string; password: string }, thunkAPI) => {
	try {
		const { data } = await axios.post(`/api/auth/login`, options)
		const userData = {
			username: options.userName,
			token: data.token,
			role: data.role,
			pages: data.pages
		}
		localStorage.setItem('user', JSON.stringify(userData))
		return userData
	} catch (e) {
		const message = getErrorMessage(e)
		return thunkAPI.rejectWithValue(message)
	}
})

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout() {
			localStorage.clear()
		}
	},
	extraReducers: builder => {
		builder.addCase(login.pending, state => {
			state.loading = true
		})
		builder.addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.user = action.payload
		})
		builder.addCase(login.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const authActions = authSlice.actions
export const authReducer = authSlice.reducer
