import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import TableCell from '@mui/material/TableCell'

const useStyles = makeStyles((theme) => ({
  whiteCell: {
    color: '#fff',
    ...theme.mixins.noWrap
  }
}))

const WhiteCell = (props) => {
  const classes = useStyles()
  return (
    <TableCell className={classes.whiteCell} {...props}>{props.children}</TableCell>
  )
}

export default WhiteCell
