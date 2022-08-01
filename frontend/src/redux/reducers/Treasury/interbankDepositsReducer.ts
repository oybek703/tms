import { INTERBANKDEPOSITS_FAIL, INTERBANKDEPOSITS_START, INTERBANKDEPOSITS_SUCCESS } from '../../actions/types'

const initialState = {
  loading: false,
  interbankdeposits: {
    land: [],
    borrow: [],
    fullBorrowData: [],
    fullLandData: []
  },
  error: null
}

function interbankdeposits(state = initialState, action: any) {
  const { type, payload } = action
  switch (type) {
    case INTERBANKDEPOSITS_START:
      return { ...state, loading: true, error: null }
    case INTERBANKDEPOSITS_SUCCESS:
      return { loading: false, error: null, interbankdeposits: payload }
    case INTERBANKDEPOSITS_FAIL:
      return { ...state, loading: false, error: payload }
    default:
      return state
  }
}

export default interbankdeposits
