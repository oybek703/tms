import {
    LAST_UPDATE_FAIL,
    LAST_UPDATE_START, LAST_UPDATE_SUCCESS
} from '../../actions/types'

const initialState = {
    loading: false,
    error: null,
    lastUpdate: null
}

function lastUpdate(state = initialState, action: any) {
    const {payload, type} = action
    switch (type) {
        case LAST_UPDATE_START:
            return {...state, loading: true, error: null}
        case LAST_UPDATE_SUCCESS:
            return {loading: false, error: null, lastUpdate: payload}
        case LAST_UPDATE_FAIL:
            return {...state, loading: false, error: payload}
        default:
            return state
    }
}

export default lastUpdate