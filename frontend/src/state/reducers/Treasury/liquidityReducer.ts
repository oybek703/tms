import ActionsTypes from '../../actions/types'

const initialState = {
	liquidity: {
		liquidityAssets: [],
		obligations: []
	},
	error: null,
	loading: false
}

function liquidity(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.LIQUIDITY_START:
			return { ...state, loading: true, error: null }
		case ActionsTypes.LIQUIDITY_SUCCESS:
			return { loading: false, error: null, liquidity: payload }
		case ActionsTypes.LIQUIDITY_FAIL:
			return { ...state, loading: false, error: payload }
		default:
			return state
	}
}

export function liquidityCurrentState(state = false, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.LIQUIDITY_CURRENT_UPDATE:
			return payload
		default:
			return state
	}
}

export function liquidityCurrent(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case ActionsTypes.LIQUIDITY_CURRENT_START:
			return { ...state, loading: true, error: null }
		case ActionsTypes.LIQUIDITY_CURRENT_SUCCESS:
			return { loading: false, error: null, liquidity: payload }
		case ActionsTypes.LIQUIDITY_CURRENT_FAIL:
			return { ...state, loading: false, error: payload }
		default:
			return state
	}
}

export default liquidity
