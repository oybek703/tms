import React, { useState, useEffect } from "react"

export default function FakeSuspense({children, delay = 500, fallback = <div/>}) {
    const [isShown, setIsShown] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsShown(true)
        }, delay)
        return clearTimeout.bind(null, timeout)
    }, [delay])

    return isShown ? children : fallback
}
