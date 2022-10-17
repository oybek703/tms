import { LOGIN_FAIL, LOGIN_START, LOGIN_SUCCESS, LOGOUT } from '../../actions/types'

const initialState = {
	loading: false,
	user: JSON.parse(localStorage.getItem('user') || '{}'),
	error: null
}

function auth(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case LOGIN_START:
			return { loading: true, user: {}, error: null }
		case LOGIN_SUCCESS:
			return { loading: false, user: payload, error: null }
		case LOGIN_FAIL:
			return { error: payload, loading: false, user: {} }
		case LOGOUT:
			return { error: null, loading: false, user: {} }
		default:
			return state
	}
}

export default auth
