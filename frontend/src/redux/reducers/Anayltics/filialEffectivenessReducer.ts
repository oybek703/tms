import { FILIALEFFECTIVENESS_FAIL, FILIALEFFECTIVENESS_START, FILIALEFFECTIVENESS_SUCCESS } from '../../actions/types'

const initialState = {
	filialEffectiveness: [],
	loading: false,
	error: null
}

function filialEffectiveness(state = initialState, action: any) {
	const { type, payload } = action
	switch (type) {
		case FILIALEFFECTIVENESS_START:
			return { loading: true, error: null, filialEffectiveness: [] }
		case FILIALEFFECTIVENESS_SUCCESS:
			return { loading: false, error: null, filialEffectiveness: payload }
		case FILIALEFFECTIVENESS_FAIL:
			return { loading: false, error: payload, filialEffectiveness: [] }
		default:
			return state
	}
}

export default filialEffectiveness
