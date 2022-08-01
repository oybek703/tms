import {
  CORRESPONDENT_CURRENT_FAIL,
  CORRESPONDENT_CURRENT_START, CORRESPONDENT_CURRENT_SUCCESS,
  CORRESPONDENT_CURRENT_UPDATE,
  CORRESPONDENT_FAIL,
  CORRESPONDENT_START, CORRESPONDENT_SUCCESS
} from '../../actions/types'

const initialState = {
  loading: false,
  correspondent: {
    currencyRate: [],
    totalCash: [],
    interbankDeposits: []
  },
  error: null
}

function correspondent(state = initialState, action: any) {
  const { type, payload } = action
  switch (type) {
    case CORRESPONDENT_START:
      return { ...state, loading: true, error: null }
    case CORRESPONDENT_SUCCESS:
      return { loading: false, error: null, correspondent: payload }
    case CORRESPONDENT_FAIL:
      return { ...state, loading: false, error: payload }
    default:
      return state
  }
}

export function correspondentCurrentState(state = false, action: any) {
  const { type, payload } = action
  switch (type) {
    case CORRESPONDENT_CURRENT_UPDATE:
      return payload
    default:
      return state
  }
}

export function correspondentCurrent(state = initialState, action: any) {
  const { type, payload } = action
  switch (type) {
    case CORRESPONDENT_CURRENT_START:
      return { ...state, loading: true, error: null }
    case CORRESPONDENT_CURRENT_SUCCESS:
      return { loading: false, error: null, correspondent: payload }
    case CORRESPONDENT_CURRENT_FAIL:
      return { ...state, loading: false, error: payload }
    default:
      return state
  }
}

export default correspondent
