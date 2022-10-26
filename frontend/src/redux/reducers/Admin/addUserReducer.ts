import ActionsTypes from '../../actions/types'

const initialState = {
	loading: false,
	state: 'ended',
	error: null
}

function addUser(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.ADDUSER_START:
			return { loading: true, state: 'start', error: null }
		case ActionsTypes.ADDUSER_SUCCESS:
			return { loading: false, state: payload, error: null }
		case ActionsTypes.ADDUSER_FAIL:
			return { error: payload, loading: false, state: 'error' }
		case ActionsTypes.ADDUSER_REFRESH:
			return { error: payload, loading: false, state: 'ended' }
		default:
			return state
	}
}

export default addUser
