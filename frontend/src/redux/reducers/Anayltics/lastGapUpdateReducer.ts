import ActionsTypes from '../../actions/types'

const initialState = {
	loading: false,
	error: null,
	lastGapUpdate: null
}

function lastGapUpdate(state = initialState, action: any) {
	const { payload, type } = action
	switch (type) {
		case ActionsTypes.GAP_LAST_UPDATE_START:
			return { ...state, loading: true, error: null }
		case ActionsTypes.GAP_LAST_UPDATE_SUCCESS:
			return { loading: false, error: null, lastGapUpdate: payload }
		case ActionsTypes.GAP_LAST_UPDATE_FAIL:
			return { ...state, loading: false, error: payload }
		default:
			return state
	}
}

export default lastGapUpdate
