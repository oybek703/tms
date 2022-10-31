import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from '../app/rootReducer'

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

export default useTypedSelector
