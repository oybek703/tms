import { USERS_FAIL, USERS_START, USERS_SUCCESS } from '../../actions/types'

const initialState = {
	loading: false,
	error: null,
	users: []
}

function users(state = initialState, action: any) {
	const { payload, type } = action
	switch (type) {
		case USERS_START:
			return { loading: true, error: null, users: [] }
		case USERS_SUCCESS:
			return { loading: false, error: null, users: payload }
		case USERS_FAIL:
			return { ...state, loading: false, error: payload }
		default:
			return state
	}
}

export default users
