import { GAPMANUAL_FAIL, GAPMANUAL_START, GAPMANUAL_SUCCESS } from '../../actions/types'

const initialState = {
  gapManual: {},
  loading: false,
  error: null
}

function gapManual(state = initialState, action: any) {
  const { type, payload } = action
  switch (type) {
    case GAPMANUAL_START:
      return { loading: true, error: null, gapManual: [] }
    case GAPMANUAL_SUCCESS:
      return { loading: false, error: null, gapManual: payload }
    case GAPMANUAL_FAIL:
      return { loading: false, error: payload, gapManual: [] }
    default:
      return state
  }
}

export default gapManual
