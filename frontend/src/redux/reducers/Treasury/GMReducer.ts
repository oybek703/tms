import { GM_FAIL, GM_START, GM_SUCCESS } from '../../actions/types'

const initialState = {
	gm: {
		tableData: [],
		accredetiv: {},
		currRates: []
	},
	loading: false,
	error: null
}

function gm(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case GM_START:
			return { loading: true, error: null, gm: [] }
		case GM_SUCCESS:
			return { loading: false, error: null, gm: payload }
		case GM_FAIL:
			return { loading: false, error: payload, gm: [] }
		default:
			return state
	}
}

export default gm
