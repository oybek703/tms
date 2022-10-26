import ActionsTypes from '../../actions/types'

const initialState = {
	loading: false,
	depositsbydeadline: [],
	error: null
}

function depositsByDeadline(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.DEPOSITSBYDEADLINE_START:
			return { loading: true, depositsbydeadline: [], error: null }
		case ActionsTypes.DEPOSITSBYDEADLINE_SUCCESS:
			return { loading: false, depositsbydeadline: payload, error: null }
		case ActionsTypes.DEPOSITSBYDEADLINE_FAIL:
			return { error: payload, loading: false, depositsbydeadline: [] }
		default:
			return state
	}
}

export default depositsByDeadline
