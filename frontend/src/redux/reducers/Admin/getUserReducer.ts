import ActionsTypes from '../../actions/types'

const initialState = {
	loading: false,
	error: null,
	user: {}
}

function getUser(state = initialState, action: any) {
	const { payload, type } = action
	switch (type) {
		case ActionsTypes.GETUSER_START:
			return { loading: true, error: null, user: {} }
		case ActionsTypes.GETUSER_SUCCESS:
			return { loading: false, error: null, user: payload }
		case ActionsTypes.GETUSER_FAIL:
			return { ...state, loading: false, error: payload }
		default:
			return state
	}
}

export default getUser
