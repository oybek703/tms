import {
  GETUSER_START,
  GETUSER_FAIL,
  GETUSER_SUCCESS
} from '../../actions/types'

const initialState = {
  loading: false,
  error: null,
  user: {}
}

function getUser(state = initialState, action: any) {
  const { payload, type } = action
  switch (type) {
    case GETUSER_START:
      return { loading: true, error: null, user: {} }
    case GETUSER_SUCCESS:
      return { loading: false, error: null, user: payload }
    case GETUSER_FAIL:
      return { ...state, loading: false, error: payload }
    default:
      return state
  }
}

export default getUser

