import React, { useState, useEffect, PropsWithChildren } from 'react'

interface DelayedProps {
  waitBeforeShow?: number,
  fallback?: any
}

const Delayed: React.FC<PropsWithChildren<DelayedProps>> = ({ fallback = null, children, waitBeforeShow = 500 }) => {
  const [isShown, setIsShown] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true)
    }, waitBeforeShow)
    return () => clearTimeout(timer)
  }, [waitBeforeShow])

  return isShown ? children : fallback
}

export default Delayed
