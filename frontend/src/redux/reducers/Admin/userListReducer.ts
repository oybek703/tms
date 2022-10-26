import ActionsTypes from '../../actions/types'

const initialState = {
	loading: false,
	error: null,
	users: []
}

function users(state = initialState, action: any) {
	const { payload, type } = action
	switch (type) {
		case ActionsTypes.USERS_START:
			return { loading: true, error: null, users: [] }
		case ActionsTypes.USERS_SUCCESS:
			return { loading: false, error: null, users: payload }
		case ActionsTypes.USERS_FAIL:
			return { ...state, loading: false, error: payload }
		default:
			return state
	}
}

export default users
