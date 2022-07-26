import {
  ADDUSER_START,
  ADDUSER_SUCCESS,
  ADDUSER_FAIL, ADDUSER_REFRESH,
} from '../../actions/types'

const initialState = {
  loading: false,
  state: 'ended',
  error: null,
}

function addUser(state = initialState, action: any) {
  const { type, payload } = action
  switch (type) {
    case ADDUSER_START:
      return { loading: true, state: 'start', error: null }
    case ADDUSER_SUCCESS:
      return { loading: false, state: payload, error: null }
    case ADDUSER_FAIL:
      return { error: payload, loading: false, state: 'error' }
    case ADDUSER_REFRESH:
      return { error: payload, loading: false, state: 'ended' }
    default:
      return state
  }
}

export default addUser
