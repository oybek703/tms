import { LOGOUT, USER_EXITED } from '../actions/types'
import { Action, Dispatch } from 'redux'

interface CustomAction extends Action{
    type: string
    payload?: any
}

export function checkLogoutType() {
  return function(dispatch: Dispatch) {
    return function(action: CustomAction) {
      const { type, payload } = action
      if (type === LOGOUT && payload === USER_EXITED) {
        const { origin } = window.location
        localStorage.clear()
        window.location.replace(`${origin}/login`)
      }
      return dispatch(action)
    }
  }
}
