import {OPERATIONAL_DAYS_FAIL, OPERATIONAL_DAYS_START, OPERATIONAL_DAYS_SUCCESS} from "../../actions/types"

const initialState = {
    loading: false,
    error: null,
    operDays: JSON.parse(localStorage.getItem('oper_days') || '[]')
}

function operDays(state = initialState, action) {
    const {payload, type} = action
    switch (type) {
        case OPERATIONAL_DAYS_START:
            return {...state, loading: true, error: null}
        case OPERATIONAL_DAYS_SUCCESS:
            return {loading: false, error: null, operDays: payload}
        case OPERATIONAL_DAYS_FAIL:
            return {...state, loading: false, error: payload}
        default:
            return state
    }
}

export default operDays