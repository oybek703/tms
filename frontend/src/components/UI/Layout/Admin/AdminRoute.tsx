import React from 'react'
import { Redirect } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import { RouteComponentProps } from 'react-router'

interface AdminRouteProps {
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any> | undefined
  exact?: boolean
  path: string
}

const AdminRoute: React.FC<AdminRouteProps> = ({ component, exact = false, path = '/' }) => {
  const { user: { role } } = useTypedSelector((state) => state.auth)
  if (role !== 'admin') return <Redirect to='/403'/>
  return <PrivateRoute component={component} path={path} exact={exact}/>
}

export default AdminRoute
