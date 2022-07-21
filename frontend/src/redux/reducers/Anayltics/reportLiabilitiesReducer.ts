import {
    REPORTLIABILITIES_FAIL,
    REPORTLIABILITIES_START,
    REPORTLIABILITIES_SUCCESS
} from '../../actions/types'

const initialState = {
    reportliabilities: [],
    loading: false,
    error: null
}

function reportLiabilities(state = initialState, action: any) {
    const {type, payload} = action
    switch (type) {
        case REPORTLIABILITIES_START:
            return {loading: true, error: null, reportliabilities: []}
        case REPORTLIABILITIES_SUCCESS:
            return {loading: false, error: null, reportliabilities: payload}
        case REPORTLIABILITIES_FAIL:
            return {loading: false, error: payload, reportliabilities: []}
        default:
            return state
    }
}

export default reportLiabilities