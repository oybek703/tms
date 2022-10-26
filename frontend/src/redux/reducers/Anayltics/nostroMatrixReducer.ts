import ActionsTypes from '../../actions/types'

const initialState = {
	nostroMatrix: [],
	loading: false,
	error: null
}

function nostroMatrix(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.NOSTROMATRIX_START:
			return { loading: true, error: null, nostroMatrix: [] }
		case ActionsTypes.NOSTROMATRIX_SUCCESS:
			return { loading: false, error: null, nostroMatrix: payload }
		case ActionsTypes.NOSTROMATRIX_FAIL:
			return { loading: false, error: payload, nostroMatrix: [] }
		default:
			return state
	}
}

export default nostroMatrix
