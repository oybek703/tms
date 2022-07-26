import React, { PropsWithChildren } from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  whiteBold: {
    color: '#fff',
  },
}))

const BoldWithColor: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const classes = useStyles()
  return (
    <b className={classes.whiteBold}>
      {children}
    </b>
  )
}

export default BoldWithColor
