import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch, withToken } from '../../utils/axiosUtils'
import { APIRoutes } from '../../interfaces/apiRoutes.interface'
import { getErrorMessage } from '../../utils'
import axios from 'axios'

const initialState = {
	usersLoading: false,
	usersError: null,
	users: [],
	singleUser: undefined,
	singleUserLoading: false,
	singleUserError: undefined
}

const prefix = 'admin'
const usersPrefix = `${prefix}/users`
const editUserPrefix = `${prefix}/users/edit`

export const fetchUsers = createAsyncThunk(usersPrefix, async (_, thunkAPI) => {
	try {
		const { data } = await axios.get('/api/users', withToken())
		return data
	} catch (e) {
		const message = getErrorMessage(e)
		return thunkAPI.rejectWithValue(message)
	}
})

export const fetchSingleUser = createAsyncThunk(editUserPrefix, async (id: number, thunkAPI) => {
	try {
		const { data } = await axios.get(`/api/users/${id}`, withToken())
		return data
	} catch (e) {
		const message = getErrorMessage(e)
		return thunkAPI.rejectWithValue(message)
	}
})

export const deleteUserByName = createAsyncThunk(editUserPrefix, async (userName: string, thunkAPI) => {
	try {
		await axios.delete(`/api/users/${userName}`, withToken())
	} catch (e) {
		const message = getErrorMessage(e)
		return thunkAPI.rejectWithValue(message)
	}
})

const fcrbSlice = createSlice({
	name: prefix,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchUsers.pending, state => {
			state.usersLoading = true
		})
		builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<any>) => {
			state.usersLoading = false
			state.users = action.payload
		})
		builder.addCase(fetchUsers.rejected, (state, action: PayloadAction<any>) => {
			state.usersLoading = false
			state.usersError = action.payload
		})
		builder.addCase(fetchSingleUser.pending, state => {
			state.singleUserLoading = true
		})
		builder.addCase(fetchSingleUser.fulfilled, (state, action: PayloadAction<any>) => {
			state.singleUserLoading = false
			state.singleUser = action.payload
		})
		builder.addCase(fetchSingleUser.rejected, (state, action: PayloadAction<any>) => {
			state.singleUserLoading = false
			state.singleUserError = action.payload
		})
	}
})

export const adminActions = fcrbSlice.actions
export const adminReducer = fcrbSlice.reducer
