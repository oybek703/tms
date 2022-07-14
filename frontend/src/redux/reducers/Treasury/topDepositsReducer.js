import {TOPDEPOSITS_FAIL, TOPDEPOSITS_START, TOPDEPOSITS_SUCCESS} from "../../actions/types"

const initialState = {
    loading: false,
    topDeposits: {},
    error: null
}

function topDeposits(state = initialState, action) {
    const {type, payload} = action
    switch (type) {
        case TOPDEPOSITS_START:
            return {...state, loading: true, error: null}
        case TOPDEPOSITS_SUCCESS:
            return {loading: false, error: null, topDeposits: payload}
        case TOPDEPOSITS_FAIL:
            return {...state, loading: false, error: payload}
        default:
            return state
    }
}

export default topDeposits