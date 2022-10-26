import ActionsTypes from '../../actions/types'

const initialState = {
	loading: false,
	error: null,
	operDays: []
}

function operDays(state = initialState, action: any) {
	const { payload, type } = action
	switch (type) {
		case ActionsTypes.OPERATIONAL_DAYS_START:
			return { ...state, loading: true, error: null }
		case ActionsTypes.OPERATIONAL_DAYS_SUCCESS:
			return { loading: false, error: null, operDays: payload }
		case ActionsTypes.OPERATIONAL_DAYS_FAIL:
			return { ...state, loading: false, error: payload }
		default:
			return state
	}
}

export default operDays
