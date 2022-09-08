import {
    BANKS_FAIL,
    BANKS_START,
    BANKS_SUCCESS
} from '../../actions/types'

const initialState = {
    loading: false,
    error: null,
    banks: []
}

function banks(state = initialState, action: any) {
    const { payload, type } = action
    switch (type) {
        case BANKS_START:
            return { loading: true, error: null, banks: [] }
        case BANKS_SUCCESS:
            return { loading: false, error: null, banks: payload }
        case BANKS_FAIL:
            return { ...state, loading: false, error: payload }
        default:
            return state
    }
}

export default banks

