import {
  GET_ADDED_BANKS_FAIL,
  GET_ADDED_BANKS_START,
  GET_ADDED_BANKS_SUCCESS
} from '../../actions/types'

const initialState = {
  loading: false,
  error: null,
  banks: []
}

function banks(state = initialState, action: any) {
  const { payload, type } = action
  switch (type) {
    case GET_ADDED_BANKS_START:
      return { loading: true, error: null, banks: [] }
    case GET_ADDED_BANKS_SUCCESS:
      return { loading: false, error: null, banks: payload }
    case GET_ADDED_BANKS_FAIL:
      return { ...state, loading: false, error: payload }
    default:
      return state
  }
}

export default banks

