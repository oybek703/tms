import * as actionCreators from '../redux/actions'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

const useActions = function () {
    const dispatch = useDispatch()
    return bindActionCreators(actionCreators, dispatch)
}

export default useActions