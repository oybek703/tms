import {
    LIQUIDITY_CURRENT_FAIL,
    LIQUIDITY_CURRENT_START,
    LIQUIDITY_CURRENT_SUCCESS,
    LIQUIDITY_CURRENT_UPDATE,
    LIQUIDITY_FAIL,
    LIQUIDITY_START,
    LIQUIDITY_SUCCESS
} from '../../actions/types'

const initialState = {
    liquidity: {
        liquidityAssets: [],
        obligations: []
    },
    error: null,
    loading: false
}

function liquidity(state = initialState, action: any) {
    const {type, payload} = action
    switch (type) {
        case LIQUIDITY_START:
            return {...state, loading: true, error: null}
        case LIQUIDITY_SUCCESS:
            return {loading: false, error: null, liquidity: payload}
        case LIQUIDITY_FAIL:
            return {...state, loading: false, error: payload}
        default:
            return state
    }
}

export function liquidityCurrentState(state = false, action: any) {
    const {type, payload} = action
    switch (type) {
        case LIQUIDITY_CURRENT_UPDATE:
            return payload
        default:
            return state
    }
}

export function liquidityCurrent(state = initialState, action: any) {
    const {type, payload} = action
    switch (type) {
        case LIQUIDITY_CURRENT_START:
            return {...state, loading: true, error: null}
        case LIQUIDITY_CURRENT_SUCCESS:
            return {loading: false, error: null, liquidity: payload}
        case LIQUIDITY_CURRENT_FAIL:
            return {...state, loading: false, error: payload}
        default:
            return state
    }
}

export default liquidity