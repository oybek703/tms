import ActionsTypes from '../../actions/types'

const initialState = {
	loading: false,
	dashboardMonthly: [],
	error: null
}

function dashboardMonthly(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.DASHBOARDMONTHLY_START:
			return { ...state, loading: true, error: null }
		case ActionsTypes.DASHBOARDMONTHLY_SUCCESS:
			return { loading: false, error: null, dashboardMonthly: payload }
		case ActionsTypes.DASHBOARDMONTHLY_FAIL:
			return { ...state, loading: false, error: payload }
		default:
			return state
	}
}

export default dashboardMonthly
