import {GAP_FAIL, GAP_START, GAP_SUCCESS} from '../../actions/types'

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

function gap(state = initialState, action) {
    const {type, payload} = action
    switch (type) {
        case GAP_START:
            return {loading: true, gap: {}, error: null}
        case GAP_SUCCESS:
            return {loading: false, gap: payload, error: null}
        case GAP_FAIL:
            return {error: payload, loading: false, gap: {}}
        default:
            return state
    }
}

export default gap