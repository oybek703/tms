import * as  React from 'react'
import ErrorAlert from "./ErrorAlert"
import { Component, ErrorInfo } from 'react'

class ErrorBoundary extends Component {
    constructor() {
        // @ts-ignore
        super()
        this.state = {
            hasError: false
        }
    }

    componentDidCatch(error: Error, _: ErrorInfo) {
        this.setState({hasError: true})
    }

    render() {
        // @ts-ignore
        const {hasError} = this.state
        const {children} = this.props
        if(hasError) return <ErrorAlert/>
        return (<>{children}</>)
    }
}

export default ErrorBoundary