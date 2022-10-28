import ActionsTypes from '../../actions/types'

const initialState = {
	bankLimits: {},
	loading: false,
	error: null
}

function bankLimits(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.BANKLIMITS_START:
			return { loading: true, error: null, bankLimits: [] }
		case ActionsTypes.BANKLIMITS_SUCCESS:
			return { loading: false, error: null, bankLimits: payload }
		case ActionsTypes.BANKLIMITS_FAIL:
			return { loading: false, error: payload, bankLimits: [] }
		default:
			return state
	}
}

export default bankLimits
