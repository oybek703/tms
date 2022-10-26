import ActionsTypes from '../../actions/types'

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
		case ActionsTypes.GM_START:
			return { loading: true, error: null, gm: [] }
		case ActionsTypes.GM_SUCCESS:
			return { loading: false, error: null, gm: payload }
		case ActionsTypes.GM_FAIL:
			return { loading: false, error: payload, gm: [] }
		default:
			return state
	}
}

export default gm
