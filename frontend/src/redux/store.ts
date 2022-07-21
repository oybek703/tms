import { applyMiddleware, compose, createStore } from 'redux'
import rootReducer from './reducers'
import thunk from 'redux-thunk'
import { checkLogoutType } from './middlewares'

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
    rootReducer,
    {},
    composeEnhancers(applyMiddleware(thunk, checkLogoutType))
)

export default store