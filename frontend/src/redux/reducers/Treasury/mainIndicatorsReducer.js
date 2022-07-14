import {MAININDICATORS_FAIL, MAININDICATORS_START, MAININDICATORS_SUCCESS} from "../../actions/types"

const initialState = {
    loading: false,
    mainIndicators: [],
    error: null
}

function mainIndicators(state = initialState, action) {
    const {type, payload} = action
    switch (type) {
        case MAININDICATORS_START:
            return {loading: true, mainIndicators: [], error: null}
        case MAININDICATORS_SUCCESS:
            return {loading: false, mainIndicators: payload, error: null}
        case MAININDICATORS_FAIL:
            return {error: payload, loading: false, mainIndicators: []}
        default:
            return state
    }
}

export default mainIndicators