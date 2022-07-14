import {LOGOUT, USER_EXITED} from '../actions/types'

export function checkLogoutType(store) {
    return function (dispatch) {
        return function (action) {
            const {type, payload} = action
            if(type === LOGOUT && payload === USER_EXITED) {
                const {origin} = window.location
                localStorage.clear()
                window.location.replace(`${origin}/login`)
            }
            return dispatch(action)
        }
    }
}