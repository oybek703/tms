import { FCRB_FAIL, FCRB_START, FCRB_SUCCESS } from '../../actions/types'

const initialState = {
	fcrb: {},
	loading: false,
	error: null
}

function fcrb(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case FCRB_START:
			return { loading: true, error: null, fcrb: {} }
		case FCRB_SUCCESS:
			return { loading: false, error: null, fcrb: payload }
		case FCRB_FAIL:
			return { loading: false, error: payload, fcrb: {} }
		default:
			return state
	}
}

export default fcrb
