import ActionsTypes from '../../actions/types'

const initialState = {
	loading: false,
	state: 'ended',
	error: null
}

function editUser(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.EDITUSER_START:
			return { loading: true, state: 'start', error: null }
		case ActionsTypes.EDITUSER_SUCCESS:
			return { loading: false, state: payload, error: null }
		case ActionsTypes.EDITUSER_FAIL:
			return { error: payload, loading: false, state: 'error' }
		case ActionsTypes.EDITUSER_REFRESH:
			return { error: payload, loading: false, state: 'ended' }
		default:
			return state
	}
}

export default editUser
