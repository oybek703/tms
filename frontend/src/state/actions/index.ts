import { getErrorMessage } from '../../utils'
import { withToken } from '../../utils/axiosUtils'
import { Dispatch } from 'redux'
import axios from 'axios'
import ActionsTypes from './types'

async function checkCashOrSave(date: string, property = 'capital', dispatch: Dispatch) {
	const cacheData = JSON.parse(<string>localStorage.getItem(property))
	const action = `${property.toUpperCase()}_`
	try {
		if (Boolean(cacheData)) {
			if (date === cacheData.date) {
				dispatch({ type: `${action}SUCCESS`, payload: cacheData.data })
			} else {
				dispatch({ type: `${action}START` })
				const {
					data: { rows }
				} = await axios.get(`/api/${property}?date=${date}`, withToken())
				const newCashData = { date: date, data: rows }
				localStorage.setItem(property, JSON.stringify(newCashData))
				dispatch({ type: `${action}SUCCESS`, payload: rows })
			}
		} else {
			dispatch({ type: `${action}START` })
			const {
				data: { rows }
			} = await axios.get(`/api/${property}?date=${date}`, withToken())
			const newCashData = { date: date, data: rows }
			localStorage.setItem(property, JSON.stringify(newCashData))
			dispatch({ type: `${action}SUCCESS`, payload: rows })
		}
	} catch (e: any) {
		const message = getErrorMessage(e)
		dispatch({ type: `${action}FAIL`, payload: message })
	}
}

export function fetchDashboard(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'dashboard', dispatch)
	}
}

export function fetchDashboardCreditData(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'creditData', dispatch)
	}
}

export function fetchMainIndicators(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'mainindicators', dispatch)
	}
}

export function fetchProfitAndLost(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'profitandlost', dispatch)
	}
}

export function fetchCalcFor(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'calcfor', dispatch)
	}
}

export function fetchGM(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'gm', dispatch)
	}
}

export function fetchInterbankDeposits(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'interbankdeposits', dispatch)
	}
}

export function fetchPlat(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'plat', dispatch)
	}
}

export function fetchTopDeposits(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'topdeposits', dispatch)
	}
}

export function fetchTimeDepoClients(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'timedepoclients', dispatch)
	}
}

export function fetchTimeDeposits(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'timedeposits', dispatch)
	}
}

export function fetchCapital(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'capital', dispatch)
	}
}

export function fetchLiquidity(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'liquidity', dispatch)
	}
}

export function changeReportDate(value: string) {
	return function (dispatch: Dispatch) {
		if (Boolean(value)) {
			localStorage.setItem('reportDate', value)
			dispatch({ type: ActionsTypes.CHANGE_DATE, payload: value })
		}
	}
}

export function fetchCorrespondent(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'correspondent', dispatch)
	}
}

export function fetchDashboardMonthly(firstDate: string, secondDate: string, dateOption: string) {
	return async function (dispatch: Dispatch) {
		try {
			dispatch({ type: ActionsTypes.DASHBOARDMONTHLY_START })
			const {
				data: { rows }
			} = await axios.get(
				`/api/dashboardmonthly?firstDate=${firstDate}&secondDate=${secondDate}&dateOption=${dateOption}`,
				withToken()
			)
			dispatch({ type: ActionsTypes.DASHBOARDMONTHLY_SUCCESS, payload: rows })
		} catch (e: any) {
			const message = getErrorMessage(e)
			dispatch({ type: ActionsTypes.DASHBOARDMONTHLY_FAIL, payload: message })
		}
	}
}

export function fetchDepositsByDeadline(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'depositsbydeadline', dispatch)
	}
}

export function fetchReportLiabilities(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'reportliabilities', dispatch)
	}
}

export function fetchFcrb(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'fcrb', dispatch)
	}
}

export function fetchNostroMatrix(firstDate: string, secondDate?: string) {
	return async function (dispatch: Dispatch) {
		try {
			dispatch({ type: ActionsTypes.NOSTROMATRIX_START })
			const {
				data: { rows }
			} = await axios.get(`/api/nostroMatrix?firstDate=${firstDate}&secondDate=${secondDate}`, withToken())
			dispatch({ type: ActionsTypes.NOSTROMATRIX_SUCCESS, payload: rows })
		} catch (e: any) {
			const message = getErrorMessage(e)
			dispatch({ type: ActionsTypes.NOSTROMATRIX_FAIL, payload: message })
		}
	}
}

export function fetchVlaBuffer(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'vlaBuffer', dispatch)
	}
}

export function fetchFilialEffectiveness(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'filialEffectiveness', dispatch)
	}
}

export function fetchCurrencyPosition(date: string) {
	return async function (dispatch: Dispatch) {
		await checkCashOrSave(date, 'currencyposition', dispatch)
	}
}

export function getOperDays() {
	return async function (dispatch: Dispatch) {
		try {
			dispatch({ type: ActionsTypes.OPERATIONAL_DAYS_START })
			const {
				data: { dates }
			} = await axios.get(`/api/operDays`)
			dispatch({ type: ActionsTypes.OPERATIONAL_DAYS_SUCCESS, payload: dates })
		} catch (e: any) {
			const error = e.toString()
			dispatch({ type: ActionsTypes.OPERATIONAL_DAYS_FAIL, payload: error })
		}
	}
}

export function getLastUpdateTime() {
	return async function (dispatch: Dispatch) {
		try {
			dispatch({ type: ActionsTypes.LAST_UPDATE_START })
			const {
				data: { lastUpdate }
			} = await axios.get(`/api/operDays/lastUpdate`)
			dispatch({ type: ActionsTypes.LAST_UPDATE_SUCCESS, payload: lastUpdate })
		} catch (e: any) {
			const error = e.toString()
			dispatch({ type: ActionsTypes.LAST_UPDATE_FAIL, payload: error })
		}
	}
}

export function signInUser({ username, password }: { username: string; password: string }) {
	return async (dispatch: Dispatch) => {
		try {
			dispatch({ type: ActionsTypes.LOGIN_START })
			const { data } = await axios.post(`/api/auth/login`, { username, password })
			const userData = {
				username,
				token: data.token,
				role: data.ROLE,
				pages: data.pages
			}
			localStorage.setItem('user', JSON.stringify(userData))
			dispatch({ type: ActionsTypes.LOGIN_SUCCESS, payload: userData })
		} catch (e: any) {
			const message = getErrorMessage(e)
			dispatch({ type: ActionsTypes.LOGIN_FAIL, payload: message })
		}
	}
}

export function addUser(formData: any) {
	return async function (dispatch: Dispatch) {
		try {
			dispatch({ type: ActionsTypes.ADDUSER_START })
			await axios.post(`/api/auth/adduser`, formData, withToken())
			dispatch({ type: ActionsTypes.ADDUSER_SUCCESS, payload: 'added' })
			setTimeout(function () {
				dispatch({ type: ActionsTypes.ADDUSER_REFRESH })
			}, 500)
		} catch (e: any) {
			const message = getErrorMessage(e)
			dispatch({ type: ActionsTypes.ADDUSER_FAIL, payload: message })
		}
	}
}

export function editUser(ID: any, formData: any) {
	return async function (dispatch: Dispatch) {
		try {
			dispatch({ type: ActionsTypes.EDITUSER_START })
			await axios.put(`/api/auth/users/${ID}`, formData, withToken())
			dispatch({ type: ActionsTypes.EDITUSER_SUCCESS, payload: 'edited' })
			setTimeout(function () {
				dispatch({ type: ActionsTypes.EDITUSER_REFRESH })
			}, 500)
		} catch (e: any) {
			const message = getErrorMessage(e)
			dispatch({ type: ActionsTypes.EDITUSER_FAIL, payload: message })
		}
	}
}

export function deleteUserByName(username: string) {
	return async function (dispatch: Dispatch) {
		try {
			await axios.delete(`/api/auth/users/${username}`, withToken())
			dispatch({ type: ActionsTypes.DELETE_USER })
		} catch (e: any) {
			console.log(e)
		}
	}
}

export function logout() {
	return function (dispatch: Dispatch) {
		localStorage.removeItem('user')
		dispatch({ type: ActionsTypes.LOGOUT, payload: ActionsTypes.USER_EXITED })
	}
}

export function fetchUsers() {
	return async function (dispatch: Dispatch) {
		try {
			dispatch({ type: ActionsTypes.USERS_START })
			const {
				data: { users }
			} = await axios.get('/api/auth/users', withToken())
			dispatch({ type: ActionsTypes.USERS_SUCCESS, payload: users })
		} catch (e: any) {
			dispatch({ type: ActionsTypes.USERS_FAIL, payload: e })
		}
	}
}

export function getUser(id: number) {
	return async function (dispatch: Dispatch) {
		try {
			dispatch({ type: ActionsTypes.GETUSER_START })
			const {
				data: { user }
			} = await axios.get(`/api/auth/users/${id}`, withToken())
			dispatch({ type: ActionsTypes.GETUSER_SUCCESS, payload: user })
		} catch (e: any) {
			dispatch({ type: ActionsTypes.GETUSER_FAIL, payload: e })
		}
	}
}

export function fetchBankLimits() {
	return async function (dispatch: Dispatch) {
		try {
			dispatch({ type: ActionsTypes.BANKLIMITS_START })
			const {
				data: { data }
			} = await axios.get('/api/banklimits', withToken())
			dispatch({ type: ActionsTypes.BANKLIMITS_SUCCESS, payload: data })
		} catch (e: any) {
			dispatch({ type: ActionsTypes.BANKLIMITS_FAIL, payload: e })
		}
	}
}

export function fetchGapManual(forEditing = false) {
	return async function (dispatch: Dispatch) {
		try {
			dispatch({ type: ActionsTypes.GAPMANUAL_START })
			const {
				data: { data }
			} = await axios.get(`/api/gapSimulation?forEditing=${forEditing}`, withToken())
			dispatch({ type: ActionsTypes.GAPMANUAL_SUCCESS, payload: data })
		} catch (e: any) {
			const message = getErrorMessage(e)
			dispatch({ type: ActionsTypes.GAPMANUAL_FAIL, payload: message })
		}
	}
}

export function fetchCorrespondentCurrent() {
	return async function (dispatch: Dispatch) {
		try {
			dispatch({ type: ActionsTypes.CORRESPONDENT_CURRENT_START })
			const {
				data: { rows }
			} = await axios.get('/api/correspondent/current_state', withToken())
			dispatch({ type: ActionsTypes.CORRESPONDENT_CURRENT_SUCCESS, payload: rows })
		} catch (e: any) {
			const message = getErrorMessage(e)
			dispatch({ type: ActionsTypes.CORRESPONDENT_CURRENT_FAIL, payload: message })
		}
	}
}

export function correspondentCurrentUpdate(state: any) {
	return {
		type: ActionsTypes.CORRESPONDENT_CURRENT_UPDATE,
		payload: state
	}
}

export function fetchLiquidityCurrent() {
	return async function (dispatch: Dispatch) {
		try {
			dispatch({ type: ActionsTypes.LIQUIDITY_CURRENT_START })
			const {
				data: { rows }
			} = await axios.get('/api/liquidity/current_state', withToken())
			dispatch({ type: ActionsTypes.LIQUIDITY_CURRENT_SUCCESS, payload: rows })
		} catch (e: any) {
			const message = getErrorMessage(e)
			dispatch({ type: ActionsTypes.LIQUIDITY_CURRENT_FAIL, payload: message })
		}
	}
}

export function liquidityCurrentUpdate(state: any) {
	return {
		type: ActionsTypes.LIQUIDITY_CURRENT_UPDATE,
		payload: state
	}
}

export function fetchGap() {
	return async function (dispatch: Dispatch) {
		try {
			dispatch({ type: ActionsTypes.GAP_START })
			const {
				data: { rows }
			} = await axios.get('/api/gap', withToken())
			dispatch({ type: ActionsTypes.GAP_SUCCESS, payload: rows })
		} catch (e: any) {
			const message = getErrorMessage(e)
			dispatch({ type: ActionsTypes.GAP_FAIL, payload: message })
		}
	}
}

export function getLastGapUpdate() {
	return async function (dispatch: Dispatch) {
		try {
			dispatch({ type: ActionsTypes.GAP_LAST_UPDATE_START })
			const {
				data: { lastGapUpdate }
			} = await axios.get(`/api/gap/lastGapUpdate`, withToken())
			dispatch({ type: ActionsTypes.GAP_LAST_UPDATE_SUCCESS, payload: lastGapUpdate })
		} catch (e: any) {
			const error = getErrorMessage(e)
			dispatch({ type: ActionsTypes.GAP_LAST_UPDATE_FAIL, payload: error })
		}
	}
}

export function updateCBN(data: any) {
	return async function (dispatch: Dispatch) {
		try {
			await axios.put(`/api/calcfor/updatecbn`, data, withToken())
			dispatch({ type: ActionsTypes.UPDATE_CBN })
		} catch (e: any) {
			console.log(e)
		}
	}
}

export function updateDashboardActiveTab(newTab = 0) {
	return function (dispatch: Dispatch) {
		localStorage.setItem('dashboard_active_tab', String(newTab))
		dispatch({ type: ActionsTypes.DASHBOARD_ACTIVE_TAB_CHANGE, payload: newTab })
	}
}
