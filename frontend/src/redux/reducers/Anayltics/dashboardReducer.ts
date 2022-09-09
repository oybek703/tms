import {
  CREDITDATA_FAIL,
  CREDITDATA_START, CREDITDATA_SUCCESS,
  DASHBOARD_ACTIVE_TAB_CHANGE,
  DASHBOARD_FAIL,
  DASHBOARD_START, DASHBOARD_SUCCESS
} from '../../actions/types'

const initialState = {
  loading: false,
  dashboard: {
    dashboardCorrespondent: [],
    dashboardCurrencyPosition: [],
    timeDeposits: [],
    currencyMfi: [],
    currencyTimeDeposits: [],
    interbankDeposits: [],
    fundingStructure: [],
    currencyMBD: [],
    vla: {},
    currencyRates: []
  },
  error: null
}

function dashboard(state = initialState, action: any) {
  const { type, payload } = action
  switch (type) {
    case DASHBOARD_START:
      return { ...state, loading: true, error: null }
    case DASHBOARD_SUCCESS:
      return { loading: false, error: null, dashboard: payload }
    case DASHBOARD_FAIL:
      return { ...state, loading: false, error: payload }
    default:
      return state
  }
}

const activeTabInitialState = +(localStorage.getItem('dashboard_active_tab') || 0)

function dashboardActiveTab(state = activeTabInitialState, action: any) {
  const { type, payload } = action
  switch (type) {
    case DASHBOARD_ACTIVE_TAB_CHANGE:
      return payload
    default:
      return state
  }
}

const creditdataInitialState = {
  loading: false,
  creditData: {
    creditPart: [],
    disaggregatedByTime: [],
    issuedCredits: []
  },
  error: null
}

function creditData(state = creditdataInitialState, action: any) {
  const { type, payload } = action
  switch (type) {
    case CREDITDATA_START:
      return { ...state, loading: true, error: null }
    case CREDITDATA_SUCCESS:
      return { loading: false, error: null, creditData: payload }
    case CREDITDATA_FAIL:
      return { ...state, loading: false, error: payload }
    default:
      return state
  }
}

export { dashboard, dashboardActiveTab, creditData }
