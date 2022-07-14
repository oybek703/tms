import React, {Component} from 'react'
import ErrorAlert from "./ErrorAlert"

class ErrorBoundary extends Component {
    constructor() {
        super()
        this.state = {
            hasError: false
        }
    }

    componentDidCatch(error, _) {
        this.setState({hasError: true})
    }

    render() {
        const {hasError} = this.state
        const {children} = this.props
        if(hasError) return <ErrorAlert/>
        return (<>{children}</>)
    }
}

export default ErrorBoundary