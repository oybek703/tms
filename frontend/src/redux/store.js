import {applyMiddleware, compose, createStore} from "redux"
import rootReducer from "./reducers"
import thunk from "redux-thunk"
import {checkLogoutType} from './middlewares'

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk, checkLogoutType),
        window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
    )
)

export default store