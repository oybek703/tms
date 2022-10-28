import ActionsTypes from '../../actions/types'

const initialState = {
	loading: false,
	gap: {
		months: [],
		sourceOfLiquidity: [],
		sourceOfLiquidityTotal: [],
		needsOfLiquidity: [],
		needsOfLiquidityTotal: [],
		vlaLcrData: []
	},
	error: null
}

function gap(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.GAP_START:
			return { loading: true, gap: {}, error: null }
		case ActionsTypes.GAP_SUCCESS:
			return { loading: false, gap: payload, error: null }
		case ActionsTypes.GAP_FAIL:
			return { error: payload, loading: false, gap: {} }
		default:
			return state
	}
}

export default gap
