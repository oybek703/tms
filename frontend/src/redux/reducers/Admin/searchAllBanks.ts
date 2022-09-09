import {
  SEARCH_ALL_BANKS_FAIL,
  SEARCH_ALL_BANKS_SUCCESS,
  SEARCH_ALL_BANKS_START
} from '../../actions/types'

const initialState = {
  loading: false,
  error: null,
  banks: []
}

function searchAllBanks(state = initialState, action: any) {
  const { payload, type } = action
  switch (type) {
    case SEARCH_ALL_BANKS_START:
      return { loading: true, error: null, banks: [] }
    case SEARCH_ALL_BANKS_SUCCESS:
      return { loading: false, error: null, banks: payload }
    case SEARCH_ALL_BANKS_FAIL:
      return { ...state, loading: false, error: payload }
    default:
      return state
  }
}

export default searchAllBanks
