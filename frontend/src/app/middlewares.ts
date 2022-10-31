import { Action, Dispatch } from 'redux'

interface CustomAction extends Action {
	type: string
	payload?: any
}

export function checkLogoutType() {
	return function (dispatch: Dispatch) {
		return function (action: CustomAction) {
			const { type } = action
			if (type === 'auth/logout') {
				const { origin } = window.location
				window.location.replace(`${origin}/login`)
			}
			return dispatch(action)
		}
	}
}
