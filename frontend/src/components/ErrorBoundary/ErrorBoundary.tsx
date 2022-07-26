import React, { Component, ErrorInfo } from 'react'
import ErrorAlert from './ErrorAlert'

class ErrorBoundary extends Component {
  constructor() {
    // @ts-ignore
    super()
    this.state = {
      hasError: false,
    }
  }

  componentDidCatch(error: Error, _: ErrorInfo) {
    this.setState({ hasError: true })
  }

  render() {
    // @ts-ignore
    const { hasError } = this.state
    // eslint-disable-next-line react/prop-types
    const { children } = this.props
    if (hasError) return <ErrorAlert/>
    return (<>{children}</>)
  }
}

export default ErrorBoundary
