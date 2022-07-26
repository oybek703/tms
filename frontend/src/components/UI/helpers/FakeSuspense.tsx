import React, { useState, useEffect, PropsWithChildren } from 'react'

interface FakeSuspenseProps {
    delay?: any
    fallback?: any
}

const FakeSuspense: React.FC<PropsWithChildren<FakeSuspenseProps>> = ({ children, delay = 500, fallback = <div/> }) => {
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
