import { PROFITANDLOST_FAIL, PROFITANDLOST_START, PROFITANDLOST_SUCCESS } from '../../actions/types'

const initialState = {
  loading: false,
  profitandlost: [],
  error: null,
}

function profitAndLost(state = initialState, action: any) {
  const { type, payload } = action
  switch (type) {
    case PROFITANDLOST_START:
      return { loading: true, profitandlost: [], error: null }
    case PROFITANDLOST_SUCCESS:
      return { loading: false, profitandlost: payload, error: null }
    case PROFITANDLOST_FAIL:
      return { error: payload, loading: false, profitandlost: [] }
    default:
      return state
  }
}

export default profitAndLost
