import {
    DASHBOARD_ACTIVE_TAB_CHANGE,
    DASHBOARD_FAIL,
    DASHBOARD_START, DASHBOARD_SUCCESS
} from '../../actions/types'

const initialState = {
    loading: false,
    dashboard: {
        dashboardCorrespondent: [],
        creditPart: [],
        disaggregatedByTime: [],
        dashboardCurrencyPosition: [],
        timeDeposits: [],
        currencyMfi: [],
        currencyTimeDeposits: [],
        issuedCredits: [],
        interbankDeposits: [],
        fundingStructure: [],
        currencyMBD: [],
        vla: {},
        currencyRates: []
    },
    error: null
}

function dashboard(state = initialState, action) {
    const {type, payload} = action
    switch (type) {
        case DASHBOARD_START:
            return {...state, loading: true, error: null}
        case DASHBOARD_SUCCESS:
            return {loading: false, error: null, dashboard: payload}
        case DASHBOARD_FAIL:
            return {...state, loading: false, error: payload}
        default:
            return state
    }
}

const activeTabInitialState = +localStorage.getItem('dashboard_active_tab') || 0

function dashboardActiveTab(state = activeTabInitialState, action) {
    const {type, payload} = action
    switch (type) {
        case DASHBOARD_ACTIVE_TAB_CHANGE:
            return payload
        default:
            return state
    }
}

export {dashboard, dashboardActiveTab}