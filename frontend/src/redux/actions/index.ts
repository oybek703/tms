import {
  ADDUSER_FAIL, ADDUSER_REFRESH, ADDUSER_START, ADDUSER_SUCCESS,
  BANKLIMITS_FAIL, BANKLIMITS_START, BANKLIMITS_SUCCESS, CHANGE_DATE,
  CORRESPONDENT_CURRENT_FAIL, CORRESPONDENT_CURRENT_START,
  CORRESPONDENT_CURRENT_SUCCESS, CORRESPONDENT_CURRENT_UPDATE,
  DASHBOARD_ACTIVE_TAB_CHANGE, DASHBOARDMONTHLY_FAIL, DASHBOARDMONTHLY_START,
  DASHBOARDMONTHLY_SUCCESS, DELETE_USER, GAP_FAIL, GAP_START,
  GAP_SUCCESS, GAPMANUAL_FAIL, GAPMANUAL_START, GAPMANUAL_SUCCESS, LAST_UPDATE_FAIL,
  LAST_UPDATE_START, LAST_UPDATE_SUCCESS, LIQUIDITY_CURRENT_FAIL,
  LIQUIDITY_CURRENT_START, LIQUIDITY_CURRENT_SUCCESS, LIQUIDITY_CURRENT_UPDATE,
  LOGIN_FAIL, LOGIN_START, LOGIN_SUCCESS, LOGOUT, NOSTROMATRIX_FAIL, NOSTROMATRIX_START, NOSTROMATRIX_SUCCESS, OPERATIONAL_DAYS_FAIL,
  OPERATIONAL_DAYS_START, OPERATIONAL_DAYS_SUCCESS, UPDATE_CBN, USER_EXITED,
  USERS_FAIL, USERS_START, USERS_SUCCESS, GETUSER_START, GETUSER_FAIL, GETUSER_SUCCESS, EDITUSER_START, EDITUSER_SUCCESS, EDITUSER_REFRESH,
  EDITUSER_FAIL, GAP_LAST_UPDATE_START, GAP_LAST_UPDATE_SUCCESS, GAP_LAST_UPDATE_FAIL
} from './types'
import { formatOneDate, getErrorMessage } from '../../utils'
import { withToken } from '../../utils/axiosUtils'
import { Dispatch } from 'redux'
import axios from 'axios'

async function checkCashOrSave(date: string, property = 'capital', dispatch: Dispatch) {
  const queryDate = formatOneDate(date)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const cacheData = JSON.parse(<string>localStorage.getItem(property))
  const action = `${property.toUpperCase()}_`
  try {
    if (Boolean(cacheData)) {
      if (queryDate === cacheData.date) {
        dispatch({ type: `${action}SUCCESS`, payload: cacheData.data })
      } else {
        dispatch({ type: `${action}START` })
        const { data: { rows } } = await axios.get(
            `/api/${property}?date=${date}`,
            withToken()
        )
        const newCashData = { date: queryDate, data: rows }
        localStorage.setItem(property, JSON.stringify(newCashData))
        dispatch({ type: `${action}SUCCESS`, payload: rows })
      }
    } else {
      dispatch({ type: `${action}START` })
      const { data: { rows } } = await axios.get(
          `/api/${property}?date=${date}`,
          withToken()
      )
      const newCashData = { date: queryDate, data: rows }
      localStorage.setItem(property, JSON.stringify(newCashData))
      dispatch({ type: `${action}SUCCESS`, payload: rows })
    }
  } catch (e: any) {
    const message = getErrorMessage(e)
    dispatch({ type: `${action}FAIL`, payload: message })
  }
}

export function fetchDashboard(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(date, 'dashboard', dispatch)
  }
}

export function fetchDashboardCreditData(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(
        date,
        'creditData',
        dispatch
    )
  }
}

export function fetchMainIndicators(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(date, 'mainindicators', dispatch)
  }
}

export function fetchProfitAndLost(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(date, 'profitandlost', dispatch)
  }
}

export function fetchCalcFor(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(date, 'calcfor', dispatch)
  }
}

export function fetchGM(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(date, 'gm', dispatch)
  }
}

export function fetchInterbankDeposits(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(date, 'interbankdeposits', dispatch)
  }
}

export function fetchPlat(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(date, 'plat', dispatch)
  }
}

export function fetchTopDeposits(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(date, 'topdeposits', dispatch)
  }
}

export function fetchTimeDepoClients(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(date, 'timedepoclients', dispatch)
  }
}

export function fetchTimeDeposits(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(date, 'timedeposits', dispatch)
  }
}

export function fetchCapital(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(date, 'capital', dispatch)
  }
}

export function fetchLiquidity(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(date, 'liquidity', dispatch)
  }
}

export function changeReportDate(value: string) {
  return function(dispatch: Dispatch) {
    if (Boolean(value)) {
      localStorage.setItem('reportDate', value)
      dispatch({ type: CHANGE_DATE, payload: value })
    }
  }
}

export function fetchCorrespondent(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(date, 'correspondent', dispatch)
  }
}

export function fetchDashboardMonthly(
    firstDate: string, secondDate: string, dateOption: string) {
  return async function(dispatch: Dispatch) {
    try {
      dispatch({ type: DASHBOARDMONTHLY_START })
      const { data: { rows } } = await axios.get(
          `/api/dashboardmonthly?firstDate=${firstDate}&secondDate=${secondDate}&dateOption=${dateOption}`,
          withToken()
      )
      dispatch({ type: DASHBOARDMONTHLY_SUCCESS, payload: rows })
    } catch (e: any) {
      const message = getErrorMessage(e)
      dispatch({ type: DASHBOARDMONTHLY_FAIL, payload: message })
    }
  }
}

export function fetchDepositsByDeadline(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(date, 'depositsbydeadline', dispatch)
  }
}

export function fetchReportLiabilities(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(date, 'reportliabilities', dispatch)
  }
}

export function fetchFcrb(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(date, 'fcrb', dispatch)
  }
}

export function fetchNostroMatrix(firstDate: string, secondDate?: string) {
  return async function(dispatch: Dispatch) {
    try {
      dispatch({ type: NOSTROMATRIX_START })
      const { data: { rows } } = await axios.get(
          `/api/nostroMatrix?firstDate=${firstDate}&secondDate=${secondDate}`,
          withToken()
      )
      dispatch({ type: NOSTROMATRIX_SUCCESS, payload: rows })
    } catch (e: any) {
      const message = getErrorMessage(e)
      dispatch({ type: NOSTROMATRIX_FAIL, payload: message })
    }
  }
}

export function fetchCurrencyPosition(date: string) {
  return async function(dispatch: Dispatch) {
    await checkCashOrSave(date, 'currencyposition', dispatch)
  }
}

export function getOperDays() {
  return async function(dispatch: Dispatch) {
    try {
      dispatch({ type: OPERATIONAL_DAYS_START })
      const { data: { dates } } = await axios.get(`/api/operDays`)
      dispatch({ type: OPERATIONAL_DAYS_SUCCESS, payload: dates })
    } catch (e: any) {
      const error = e.toString()
      dispatch({ type: OPERATIONAL_DAYS_FAIL, payload: error })
    }
  }
}

export function getLastUpdateTime() {
  return async function(dispatch: Dispatch) {
    try {
      dispatch({ type: LAST_UPDATE_START })
      const { data: { lastUpdate } } = await axios.get(
          `/api/operDays/lastUpdate`)
      dispatch({ type: LAST_UPDATE_SUCCESS, payload: lastUpdate })
    } catch (e: any) {
      const error = e.toString()
      dispatch({ type: LAST_UPDATE_FAIL, payload: error })
    }
  }
}

export function signInUser({ username, password }: { username: string, password: string }) {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: LOGIN_START })
      const { data } = await axios.post(
          `/api/auth/login`,
          { username, password }
      )
      const userData = {
        username,
        token: data.token,
        role: data.ROLE,
        pages: data.pages
      }
      localStorage.setItem('user', JSON.stringify(userData))
      dispatch({ type: LOGIN_SUCCESS, payload: userData })
    } catch (e: any) {
      const message = getErrorMessage(e)
      dispatch({ type: LOGIN_FAIL, payload: message })
    }
  }
}

export function addUser(formData: any) {
  return async function(dispatch: Dispatch) {
    try {
      dispatch({ type: ADDUSER_START })
      await axios.post(
          `/api/auth/adduser`,
          formData,
          withToken()
      )
      dispatch({ type: ADDUSER_SUCCESS, payload: 'added' })
      setTimeout(function() {
        dispatch({ type: ADDUSER_REFRESH })
      }, 500)
    } catch (e: any) {
      const message = getErrorMessage(e)
      dispatch({ type: ADDUSER_FAIL, payload: message })
    }
  }
}

export function editUser(ID:any, formData: any) {
  return async function(dispatch: Dispatch) {
    try {
      dispatch({ type: EDITUSER_START })
      await axios.put(
          `/api/auth/users/${ID}`,
          formData,
          withToken()
      )
      dispatch({ type: EDITUSER_SUCCESS, payload: 'edited' })
      setTimeout(function() {
        dispatch({ type: EDITUSER_REFRESH })
      }, 500)
    } catch (e: any) {
      const message = getErrorMessage(e)
      dispatch({ type: EDITUSER_FAIL, payload: message })
    }
  }
}

export function deleteUserByName(username: string) {
  return async function(dispatch: Dispatch) {
    try {
      await axios.delete(`/api/auth/users/${username}`, withToken())
      dispatch({ type: DELETE_USER })
    } catch (e: any) {
      console.log(e)
    }
  }
}

export function logout() {
  return function(dispatch: Dispatch) {
    localStorage.removeItem('user')
    dispatch({ type: LOGOUT, payload: USER_EXITED })
  }
}

export function fetchUsers() {
  return async function(dispatch: Dispatch) {
    try {
      dispatch({ type: USERS_START })
      const { data: { users } } = await axios.get(
          '/api/auth/users', withToken())
      dispatch({ type: USERS_SUCCESS, payload: users })
    } catch (e: any) {
      dispatch({ type: USERS_FAIL, payload: e })
    }
  }
}

export function getUser(id: number) {
  return async function(dispatch: Dispatch) {
    try {
      dispatch({ type: GETUSER_START })
      const { data: { user } } = await axios.get(
          `/api/auth/users/${id}`, withToken())
      dispatch({ type: GETUSER_SUCCESS, payload: user })
    } catch (e: any) {
      dispatch({ type: GETUSER_FAIL, payload: e })
    }
  }
}

export function fetchBankLimits() {
  return async function(dispatch: Dispatch) {
    try {
      dispatch({ type: BANKLIMITS_START })
      const { data: { data } } = await axios.get(
          '/api/banklimits', withToken())
      dispatch({ type: BANKLIMITS_SUCCESS, payload: data })
    } catch (e: any) {
      dispatch({ type: BANKLIMITS_FAIL, payload: e })
    }
  }
}

export function fetchGapManual(forEditing = false) {
  return async function(dispatch: Dispatch) {
    try {
      dispatch({ type: GAPMANUAL_START })
      const { data: { data } } = await axios.get(
          `/api/gapSimulation?forEditing=${forEditing}`,
          withToken()
      )
      dispatch({ type: GAPMANUAL_SUCCESS, payload: data })
    } catch (e: any) {
      const message = getErrorMessage(e)
      dispatch({ type: GAPMANUAL_FAIL, payload: message })
    }
  }
}

export function fetchCorrespondentCurrent() {
  return async function(dispatch: Dispatch) {
    try {
      dispatch({ type: CORRESPONDENT_CURRENT_START })
      const { data: { rows } } = await axios.get(
          '/api/correspondent/current_state',
          withToken()
      )
      dispatch({ type: CORRESPONDENT_CURRENT_SUCCESS, payload: rows })
    } catch (e: any) {
      const message = getErrorMessage(e)
      dispatch({ type: CORRESPONDENT_CURRENT_FAIL, payload: message })
    }
  }
}

export function correspondentCurrentUpdate(state: any) {
  return {
    type: CORRESPONDENT_CURRENT_UPDATE,
    payload: state
  }
}

export function fetchLiquidityCurrent() {
  return async function(dispatch: Dispatch) {
    try {
      dispatch({ type: LIQUIDITY_CURRENT_START })
      const { data: { rows } } = await axios.get(
          '/api/liquidity/current_state',
          withToken()
      )
      dispatch({ type: LIQUIDITY_CURRENT_SUCCESS, payload: rows })
    } catch (e: any) {
      const message = getErrorMessage(e)
      dispatch({ type: LIQUIDITY_CURRENT_FAIL, payload: message })
    }
  }
}

export function liquidityCurrentUpdate(state: any) {
  return {
    type: LIQUIDITY_CURRENT_UPDATE,
    payload: state
  }
}

export function fetchGap() {
  return async function(dispatch: Dispatch) {
    try {
      dispatch({ type: GAP_START })
      const { data: { rows } } = await axios.get(
          '/api/gap',
          withToken()
      )
      dispatch({ type: GAP_SUCCESS, payload: rows })
    } catch (e: any) {
      const message = getErrorMessage(e)
      dispatch({ type: GAP_FAIL, payload: message })
    }
  }
}

export function getLastGapUpdate() {
  return async function(dispatch: Dispatch) {
    try {
      dispatch({ type: GAP_LAST_UPDATE_START })
      const { data: { lastGapUpdate } } = await axios.get(
          `/api/gap/lastGapUpdate`,
          withToken()
      )
      dispatch({ type: GAP_LAST_UPDATE_SUCCESS, payload: lastGapUpdate })
    } catch (e: any) {
      const error = getErrorMessage(e)
      dispatch({ type: GAP_LAST_UPDATE_FAIL, payload: error })
    }
  }
}

export function updateCBN(data: any) {
  return async function(dispatch: Dispatch) {
    try {
      await axios.put(
          `/api/calcfor/updatecbn`,
          data,
          withToken()
      )
      dispatch({ type: UPDATE_CBN })
    } catch (e: any) {
      console.log(e)
    }
  }
}

export function updateDashboardActiveTab(newTab = 0) {
  return function(dispatch: Dispatch) {
    localStorage.setItem('dashboard_active_tab', String(newTab))
    dispatch({ type: DASHBOARD_ACTIVE_TAB_CHANGE, payload: newTab })
  }
}
