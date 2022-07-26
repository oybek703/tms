import { TIMEDEPOCLIENTS_FAIL, TIMEDEPOCLIENTS_START, TIMEDEPOCLIENTS_SUCCESS } from '../../actions/types'

const initialState = {
  loading: false,
  timeDepoClients: [],
  error: null,
}

function timeDepoClients(state = initialState, action: any) {
  const { type, payload } = action
  switch (type) {
    case TIMEDEPOCLIENTS_START:
      return { ...state, loading: true, error: null }
    case TIMEDEPOCLIENTS_SUCCESS:
      return { loading: false, error: null, timeDepoClients: payload }
    case TIMEDEPOCLIENTS_FAIL:
      return { ...state, loading: false, error: payload }
    default:
      return state
  }
}

export default timeDepoClients
