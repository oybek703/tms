import ActionsTypes from '../../actions/types'

const initialState = {
	loading: false,
	topDeposits: {},
	error: null
}

function topDeposits(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.TOPDEPOSITS_START:
			return { ...state, loading: true, error: null }
		case ActionsTypes.TOPDEPOSITS_SUCCESS:
			return { loading: false, error: null, topDeposits: payload }
		case ActionsTypes.TOPDEPOSITS_FAIL:
			return { ...state, loading: false, error: payload }
		default:
			return state
	}
}

export default topDeposits
