import React, { PropsWithChildren } from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import makeStyles from '@mui/styles/makeStyles'

interface StylesProps {
    isGrey: boolean
    redBack: boolean
    textAlign?: string
}

const useStyles = makeStyles({
  no_border: {
    border: 'none',
    backgroundColor: '#fff',
    whiteSpace: 'nowrap'
  },
  redBack: {
    color: ({ isGrey, redBack }: StylesProps) => isGrey || redBack ?
            '#fff' :
            '#000',
    backgroundColor: ({ isGrey, redBack }: StylesProps) => isGrey ?
            `#7794aa` :
            redBack ? 'red' : 'fff',
    fontSize: 14
  }
})

interface WrapperProps {
    isHead: boolean
}

const Wrapper: React.FC<PropsWithChildren<WrapperProps>> = ({ children, isHead = true }) => {
  return isHead ? <TableHead>{children}</TableHead> : <>{children}</>
}

interface TableCapProps {
    rows: any
    text: string
    redBack?: boolean
    isGrey?: boolean
    isHead?: boolean
    cellStyles?: any
    textAlign?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined
}

const TableCap: React.FC<TableCapProps> = ({ rows, text, redBack = false, isGrey = false, isHead = true, cellStyles = {}, textAlign = 'right' }) => {
  const classes = useStyles({ isGrey, redBack, textAlign })
  return (
    <Wrapper isHead={isHead}>
      <TableRow>
        {new Array(rows - 1).fill('').map((c, i) => <TableCell style={{ ...cellStyles }}
          className={classes.no_border}
          key={i}><b>{''}</b></TableCell>)}
        <TableCell style={{ ...cellStyles }}
          className={`${classes.no_border} ${classes.redBack}`}
          align={textAlign}>
          <b><i>{text}</i></b>
        </TableCell>
      </TableRow>
    </Wrapper>
  )
}

export default TableCap
