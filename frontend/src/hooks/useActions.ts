import * as actionCreators from '../redux/actions'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useMemo } from 'react'

const useActions = function() {
  const dispatch = useDispatch()
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch)
  }, [dispatch])
}

export default useActions
