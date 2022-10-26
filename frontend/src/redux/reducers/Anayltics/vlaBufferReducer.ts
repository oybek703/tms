import ActionsTypes from '../../actions/types'

const initialState = {
	vlaBuffer: {},
	loading: false,
	error: null
}

function vlaBuffer(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.VLABUFFER_START:
			return { loading: true, error: null, vlaBuffer: {} }
		case ActionsTypes.VLABUFFER_SUCCESS:
			return { loading: false, error: null, vlaBuffer: payload }
		case ActionsTypes.VLABUFFER_FAIL:
			return { loading: false, error: payload, vlaBuffer: {} }
		default:
			return state
	}
}

export default vlaBuffer
