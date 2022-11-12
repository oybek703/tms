import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import useTypedSelector from '../../../hooks/useTypedSelector'
import { RouteComponentProps } from 'react-router'

interface PrivateRouteProps {
	component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any> | undefined
	path?: string
	exact?: boolean
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component, path = '/', exact = false }) => {
	const {
		user: { token }
	} = useTypedSelector(state => state.auth)
	if (!token) return <Redirect to={`/login?redirectTo=${path}`} />
	return <Route component={component} path={path} exact={exact} />
}

export default PrivateRoute
