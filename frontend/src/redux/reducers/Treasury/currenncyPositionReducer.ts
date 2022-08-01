import {
  CURRENCYPOSITION_FAIL,
  CURRENCYPOSITION_START, CURRENCYPOSITION_SUCCESS
} from '../../actions/types'

const initialState = {
  loading: false,
  currencyPosition: {
    allRows: [],
    tableSumData: []
  },
  error: null
}

function currencyPosition(state = initialState, action: any) {
  const { type, payload } = action
  switch (type) {
    case CURRENCYPOSITION_START:
      return { ...state, loading: true, error: null }
    case CURRENCYPOSITION_SUCCESS:
      return { loading: false, error: null, currencyPosition: payload }
    case CURRENCYPOSITION_FAIL:
      return { ...state, loading: false, error: payload }
    default:
      return state
  }
}

export default currencyPosition
