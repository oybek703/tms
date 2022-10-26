import ActionsTypes from '../../actions/types'

const initialState = {
	loading: false,
	timeDepoClients: [],
	error: null
}

function timeDepoClients(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.TIMEDEPOCLIENTS_START:
			return { ...state, loading: true, error: null }
		case ActionsTypes.TIMEDEPOCLIENTS_SUCCESS:
			return { loading: false, error: null, timeDepoClients: payload }
		case ActionsTypes.TIMEDEPOCLIENTS_FAIL:
			return { ...state, loading: false, error: payload }
		default:
			return state
	}
}

export default timeDepoClients
