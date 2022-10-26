import ActionsTypes from '../../actions/types'

const initialState = {
	loading: false,
	plat: {
		involvedFunds: [],
		placedFunds: []
	},
	error: null
}

function plat(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.PLAT_START:
			return { ...state, loading: true, error: null }
		case ActionsTypes.PLAT_SUCCESS:
			return { loading: false, error: null, plat: payload }
		case ActionsTypes.PLAT_FAIL:
			return { ...state, loading: false, error: payload }
		default:
			return state
	}
}

export default plat
