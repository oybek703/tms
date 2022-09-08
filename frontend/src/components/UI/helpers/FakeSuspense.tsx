import React, { useState, useEffect, PropsWithChildren } from 'react'
import { LinearProgress } from '@material-ui/core'

function LinearFallback() {
  return <div style={{ margin: '20px 0' }}>
    <LinearProgress /></div>
}

interface FakeSuspenseProps {
    delay?: any
    fallback?: any
}

const FakeSuspense: React.FC<PropsWithChildren<FakeSuspenseProps>> = ({
  children,
  delay = 500,
  fallback = <LinearFallback/>
}) => {
  const [isShown, setIsShown] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShown(true)
    }, delay)
    return clearTimeout.bind(null, timeout)
  }, [delay])

  return isShown ? children : fallback
}

export default FakeSuspense
