import {
  EDITUSER_START,
  EDITUSER_SUCCESS,
  EDITUSER_FAIL, EDITUSER_REFRESH
} from '../../actions/types'

const initialState = {
  loading: false,
  state: 'ended',
  error: null
}

function editUser(state = initialState, action: any) {
  const { type, payload } = action
  switch (type) {
    case EDITUSER_START:
      return { loading: true, state: 'start', error: null }
    case EDITUSER_SUCCESS:
      return { loading: false, state: payload, error: null }
    case EDITUSER_FAIL:
      return { error: payload, loading: false, state: 'error' }
    case EDITUSER_REFRESH:
      return { error: payload, loading: false, state: 'ended' }
    default:
      return state
  }
}

export default editUser

