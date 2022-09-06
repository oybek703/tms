import { GAP_LAST_UPDATE_FAIL, GAP_LAST_UPDATE_START, GAP_LAST_UPDATE_SUCCESS } from '../../actions/types'

const initialState = {
  loading: false,
  error: null,
  lastGapUpdate: null
}

function lastGapUpdate(state = initialState, action: any) {
  const { payload, type } = action
  switch (type) {
    case GAP_LAST_UPDATE_START:
      return { ...state, loading: true, error: null }
    case GAP_LAST_UPDATE_SUCCESS:
      return { loading: false, error: null, lastGapUpdate: payload }
    case GAP_LAST_UPDATE_FAIL:
      return { ...state, loading: false, error: payload }
    default:
      return state
  }
}

export default lastGapUpdate
