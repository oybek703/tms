import { VLABUFFER_FAIL, VLABUFFER_START, VLABUFFER_SUCCESS } from '../../actions/types'

const initialState = {
  vlaBuffer: {},
  loading: false,
  error: null
}

function vlaBuffer(state = initialState, action: any) {
  const { type, payload } = action
  switch (type) {
    case VLABUFFER_START:
      return { loading: true, error: null, vlaBuffer: {} }
    case VLABUFFER_SUCCESS:
      return { loading: false, error: null, vlaBuffer: payload }
    case VLABUFFER_FAIL:
      return { loading: false, error: payload, vlaBuffer: {} }
    default:
      return state
  }
}

export default vlaBuffer
