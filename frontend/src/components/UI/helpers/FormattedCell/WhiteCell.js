import React from 'react'
import { makeStyles } from '@material-ui/core'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  whiteCell: {
    color: '#fff',
    ...theme.mixins.noWrap,
  },
}))

const WhiteCell = (props) => {
  const classes = useStyles()
  return (
    <TableCell className={classes.whiteCell} {...props}>{props.children}</TableCell>
  )
}

export default WhiteCell
