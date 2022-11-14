import axios, { AxiosRequestConfig } from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { getErrorMessage } from './index'
import { ApiRoutesType } from '../interfaces/apiRoutes.interface'
import { RootState } from '../app/rootReducer'

axios.interceptors.request.use(
	function (config: AxiosRequestConfig) {
		if (config && config.url && config.url.includes('dashboard')) {
			setTimeout(function () {
				localStorage.removeItem('dashboard')
			}, 1800000)
		}
		return config
	},
	function (error) {
		return Promise.reject(error)
	}
)

axios.interceptors.response.use(
	function (response) {
		return response
	},
	function (error) {
		const { response = {} } = error
		const { status } = response
		if (status === 440 || status === 401) {
			localStorage.clear()
			window.location.reload()
		}
		return Promise.reject(error)
	}
)

export function withToken() {
	const { token } = JSON.parse(localStorage.getItem('user') || '{}')
	return {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token || ''}`
		}
	}
}

export const checkCacheOrFetch = (route: ApiRoutesType) => {
	return createAsyncThunk<any, undefined, { state: RootState }>(route, async function (_, thunkAPI) {
		try {
			const cacheData = JSON.parse(<string>localStorage.getItem(route))
			const { operDays } = thunkAPI.getState()
			const date = operDays.reportDate
			if (Boolean(cacheData) && date === cacheData.date) {
				return cacheData.data
			} else {
				const { data } = await axios.get(`/api/${route}?date=${date}`, withToken())
				const newCashData = { date: date, data }
				localStorage.setItem(route, JSON.stringify(newCashData))
				return data
			}
		} catch (e) {
			const message = getErrorMessage(e)
			return thunkAPI.rejectWithValue(message)
		}
	})
}

export const fetchWithoutCache = (prefix: string, route: ApiRoutesType) => {
	return createAsyncThunk<any, undefined, { state: RootState }>(prefix, async function (_, thunkAPI) {
		try {
			const { data } = await axios.get(route, withToken())
			return data
		} catch (e) {
			const message = getErrorMessage(e)
			return thunkAPI.rejectWithValue(message)
		}
	})
}
