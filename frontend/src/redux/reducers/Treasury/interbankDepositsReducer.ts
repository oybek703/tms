import ActionsTypes from '../../actions/types'

const initialState = {
	loading: false,
	interbankdeposits: {
		land: [],
		borrow: [],
		fullBorrowData: [],
		fullLandData: []
	},
	error: null
}

function interbankdeposits(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.INTERBANKDEPOSITS_START:
			return { ...state, loading: true, error: null }
		case ActionsTypes.INTERBANKDEPOSITS_SUCCESS:
			return { loading: false, error: null, interbankdeposits: payload }
		case ActionsTypes.INTERBANKDEPOSITS_FAIL:
			return { ...state, loading: false, error: payload }
		default:
			return state
	}
}

export default interbankdeposits
