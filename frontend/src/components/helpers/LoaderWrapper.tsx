import React, { FC, PropsWithChildren } from 'react'
import Alert from '../layout/Alert'
import Loader from '../layout/Loader'

export const LoaderWrapper: FC<PropsWithChildren<{ loading: boolean; error?: string }>> = ({
	loading,
	error,
	children
}) => {
	return <>{loading ? <Loader /> : error ? <Alert message={error} /> : children}</>
}
