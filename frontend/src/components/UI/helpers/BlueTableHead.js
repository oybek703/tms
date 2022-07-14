import React from 'react'
import { makeStyles, TableHead } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  blueBackground: theme.mixins.blueBackground
}))

const BlueTableHead = ({children}) => {
  const classes = useStyles()
  return (
    <TableHead className={classes.blueBackground}>
      {children}
    </TableHead>
  )
}

export default BlueTableHead