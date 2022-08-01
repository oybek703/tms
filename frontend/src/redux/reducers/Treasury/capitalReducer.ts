import { CAPITAL_FAIL, CAPITAL_START, CAPITAL_SUCCESS } from '../../actions/types'

const initialState = {
  capital: [],
  loading: false,
  error: null
}

function capital(state = initialState, action: any) {
  const { type, payload } = action
  switch (type) {
    case CAPITAL_START:
      return { loading: true, error: null, capital: [] }
    case CAPITAL_SUCCESS:
      return { loading: false, error: null, capital: payload }
    case CAPITAL_FAIL:
      return { loading: false, error: payload, capital: [] }
    default:
      return state
  }
}

export default capital
