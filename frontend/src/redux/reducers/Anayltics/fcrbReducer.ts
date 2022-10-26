import ActionsTypes from '../../actions/types'

const initialState = {
	fcrb: {},
	loading: false,
	error: null
}

function fcrb(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.FCRB_START:
			return { loading: true, error: null, fcrb: {} }
		case ActionsTypes.FCRB_SUCCESS:
			return { loading: false, error: null, fcrb: payload }
		case ActionsTypes.FCRB_FAIL:
			return { loading: false, error: payload, fcrb: {} }
		default:
			return state
	}
}

export default fcrb
