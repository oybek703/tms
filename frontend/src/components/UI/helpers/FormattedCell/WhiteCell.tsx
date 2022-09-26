import React, { PropsWithChildren } from 'react'
import makeStyles from '@mui/styles/makeStyles'
import TableCell from '@mui/material/TableCell'

const useStyles = makeStyles(theme => ({
  whiteCell: {
    color: '#fff',
    ...theme.mixins.noWrap
  }
}))

interface WhiteCellProps {
  rowSpan?: number
  colSpan?: number
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'
  style?: object
}

const WhiteCell: React.FC<PropsWithChildren<WhiteCellProps>> = props => {
  const classes = useStyles()
  return (
    <TableCell className={classes.whiteCell} {...props}>{props.children}</TableCell>
  )
}

export default WhiteCell
