import ActionsTypes from '../../actions/types'

const initialState = {
	loading: false,
	user: JSON.parse(localStorage.getItem('user') || '{}'),
	error: null
}

function auth(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.LOGIN_START:
			return { loading: true, user: {}, error: null }
		case ActionsTypes.LOGIN_SUCCESS:
			return { loading: false, user: payload, error: null }
		case ActionsTypes.LOGIN_FAIL:
			return { error: payload, loading: false, user: {} }
		case ActionsTypes.LOGOUT:
			return { error: null, loading: false, user: {} }
		default:
			return state
	}
}

export default auth
