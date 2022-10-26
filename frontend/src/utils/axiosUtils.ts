import axios, { AxiosRequestConfig } from 'axios'
import store from '../redux/store'
import ActionsTypes from '../redux/actions/types'

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
		if (status === 440) {
			localStorage.clear()
			window.location.reload()
			store.dispatch({ type: ActionsTypes.LOGOUT })
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
