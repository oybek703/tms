import React from 'react'
import {useSelector} from "react-redux"
import {Redirect, Route} from 'react-router-dom'

const PrivateRoute = ({component, path = '/', exact = false}) => {
    const {user: {token}} = useSelector(state => state.auth)
    if(!token) return <Redirect to={`/login?redirectTo=${path}`}/>
    return <Route component={component} path={path} exact={exact}/>
}

export default PrivateRoute