import { Action, Dispatch } from 'redux'
import ActionsTypes from '../actions/types'

interface CustomAction extends Action {
	type: string
	payload?: any
}

export function checkLogoutType() {
	return function (dispatch: Dispatch) {
		return function (action: CustomAction) {
			const { type, payload } = action
			if (type === ActionsTypes.LOGOUT && payload === ActionsTypes.USER_EXITED) {
				const { origin } = window.location
				localStorage.clear()
				window.location.replace(`${origin}/login`)
			}
			return dispatch(action)
		}
	}
}
