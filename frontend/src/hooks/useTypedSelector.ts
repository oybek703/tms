import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from '../app/root-reducer'

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

export default useTypedSelector
