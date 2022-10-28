import ActionsTypes from '../../actions/types'

const initialState = {
	capital: [],
	loading: false,
	error: null
}

function capital(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.CAPITAL_START:
			return { loading: true, error: null, capital: [] }
		case ActionsTypes.CAPITAL_SUCCESS:
			return { loading: false, error: null, capital: payload }
		case ActionsTypes.CAPITAL_FAIL:
			return { loading: false, error: payload, capital: [] }
		default:
			return state
	}
}

export default capital
