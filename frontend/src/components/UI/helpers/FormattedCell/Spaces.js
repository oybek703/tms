import React from 'react'

const Spaces = ({ count }) => {
  return (
    <>
      {new Array(count).fill('').map((_, i) => <i key={i}>&nbsp;</i>)}
    </>
  )
}

export default Spaces
