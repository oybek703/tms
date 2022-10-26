import ActionsTypes from '../../actions/types'

const initialState = {
	loading: false,
	timeDeposits: {
		tableData: [],
		currentBalance: [],
		balanceInMonthBegin: []
	},
	error: null
}

function timeDeposits(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.TIMEDEPOSITS_START:
			return { ...state, loading: true, error: null }
		case ActionsTypes.TIMEDEPOSITS_SUCCESS:
			return { loading: false, error: null, timeDeposits: payload }
		case ActionsTypes.TIMEDEPOSITS_FAIL:
			return { ...state, loading: false, error: payload }
		default:
			return state
	}
}

export default timeDeposits
