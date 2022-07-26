import { DEPOSITSBYDEADLINE_FAIL, DEPOSITSBYDEADLINE_START, DEPOSITSBYDEADLINE_SUCCESS } from '../../actions/types'

const initialState = {
  loading: false,
  depositsbydeadline: [],
  error: null,
}

function depositsByDeadline(state = initialState, action: any) {
  const { type, payload } = action
  switch (type) {
    case DEPOSITSBYDEADLINE_START:
      return { loading: true, depositsbydeadline: [], error: null }
    case DEPOSITSBYDEADLINE_SUCCESS:
      return { loading: false, depositsbydeadline: payload, error: null }
    case DEPOSITSBYDEADLINE_FAIL:
      return { error: payload, loading: false, depositsbydeadline: [] }
    default:
      return state
  }
}

export default depositsByDeadline
