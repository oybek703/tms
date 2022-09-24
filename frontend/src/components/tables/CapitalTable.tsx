import React, { memo } from 'react'
import makeStyles from '@mui/styles/makeStyles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import Paper from '@mui/material/Paper'
import { formatNumber, formatOneDate } from '../../utils'
import TableCap from '../UI/helpers/TableCap'

import ExportButton from '../UI/Layout/ExportButton'
import BoldWithColor from '../UI/helpers/BoldWithColor'
import TableRow from '@mui/material/TableRow'
import useTypedSelector from '../../hooks/useTypedSelector'

const useStyles = makeStyles(theme =>({
  noWrap: theme.mixins.noWrap,
  italic: theme.mixins.italic,
  stickyTableHead: theme.mixins.stickyTableHead
}))

const CapitalTable: React.FC<{rows: any}> = function({ rows }) {
  const classes = useStyles()
  const { reportDate } = useTypedSelector(state => state.date)
  return (
    <TableContainer component={Paper}>
      <ExportButton id={`capital-${formatOneDate(reportDate)}`}/>
      <Table id={`capital-${formatOneDate(reportDate)}`} size="small" aria-label="a dense table">
        <TableCap rows={3} text={'тыс. сум'}/>
        <TableHead className={classes.stickyTableHead}>
          <TableRow>
            <TableCell component="th" scope="row"/>
            <TableCell component="th" scope="row" align='center'><BoldWithColor>КАПИТАЛ УРОВНЯ 1</BoldWithColor></TableCell>
            <TableCell component='th' scope='row' align='center'><BoldWithColor>Итого</BoldWithColor></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row" align='center'><b>1</b></TableCell>
            <TableCell component="th" scope="row" align='center'><b>ОСНОВНОЙ КАПИТАЛ УРОВНЯ 1</b></TableCell>
            <TableCell component="th" scope="row" align='center'>{''}</TableCell>
          </TableRow>
          {rows.map((row: any) => (
            <TableRow hover key={row.name}>
              <TableCell component="th" align='center' scope="row">{row.isTableHead ? <b>{row.first_row}</b> : row.first_row}</TableCell>
              <TableCell align="left">{row.isTableHead ? <b>{row.name}</b> : row.name}</TableCell>
              <TableCell className={classes.noWrap} align="center">{
                                row.isTableHead ?
                                    <b>{row.total===0 ? '0.00' : formatNumber(row.total)}</b> :
                                    row.total===0 ? '0.00' : formatNumber(row.total)
              }</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default memo(CapitalTable)
