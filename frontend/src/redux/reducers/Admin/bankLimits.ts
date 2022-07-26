import { BANKLIMITS_FAIL, BANKLIMITS_START, BANKLIMITS_SUCCESS } from '../../actions/types'

const initialState = {
  bankLimits: {},
  loading: false,
  error: null,
}

function bankLimits(state = initialState, action: any) {
  const { type, payload } = action
  switch (type) {
    case BANKLIMITS_START:
      return { loading: true, error: null, bankLimits: [] }
    case BANKLIMITS_SUCCESS:
      return { loading: false, error: null, bankLimits: payload }
    case BANKLIMITS_FAIL:
      return { loading: false, error: payload, bankLimits: [] }
    default:
      return state
  }
}

export default bankLimits
