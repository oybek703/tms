import React from 'react'
import {Redirect} from 'react-router-dom'
import {useSelector} from 'react-redux'
import PrivateRoute from './PrivateRoute'

const AdminRoute = ({component, exact = false, path = '/'}) => {
  const {user: {role}} = useSelector(state => state.auth)
  if (role !== 'admin') return <Redirect to='/403'/>
  return <PrivateRoute component={component} path={path} exact={exact}/>
}

export default AdminRoute