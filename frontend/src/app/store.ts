import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './root-reducer'
import { checkLogoutType } from './middlewares'

const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(checkLogoutType),
	devTools: process.env.NODE_ENV !== 'production'
})

export default store
