import { CALCFOR_FAIL, CALCFOR_START, CALCFOR_SUCCESS } from '../../actions/types'

const initialState = {
	calcfor: [],
	loading: false,
	error: null
}

function calcFor(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case CALCFOR_START:
			return { loading: true, error: null, calcfor: [] }
		case CALCFOR_SUCCESS:
			return { loading: false, error: null, calcfor: payload }
		case CALCFOR_FAIL:
			return { loading: false, error: payload, calcfor: [] }
		default:
			return state
	}
}

export default calcFor
