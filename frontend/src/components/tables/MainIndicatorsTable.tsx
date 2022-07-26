import React, { memo } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { formatDate, formatNumber } from '../../utils'
import TableCap from '../UI/helpers/TableCap'
import { makeStyles, Typography } from '@material-ui/core'
import StyledTableRow from '../UI/helpers/StyledTableRow'
import ExportButton from '../UI/Layout/ExportButton'
import BoldWithColor from '../UI/helpers/BoldWithColor'

const useStyles = makeStyles((theme) => ({
  down: theme.mixins.down,
  stickyTableHead: theme.mixins.stickyTableHead,
}))

interface MainIndicatorsTableProps {
    pickedDate: string
    rows: any
}

const MainIndicatorsTable: React.FC<MainIndicatorsTableProps> = ({ pickedDate, rows }) => {
  const { yearFirstDate, monthFirstDate, selectedDate } = formatDate(pickedDate)
  const classes = useStyles()
  return (
    <TableContainer component={Paper}>
      <ExportButton id={`main-indicators-${selectedDate}`}/>
      <Table id={`main-indicators-${selectedDate}`}
        size="small" aria-label="a dense table">
        <TableCap textAlign='right' rows={7} text={'млрд.сум'}/>
        <TableHead className={classes.stickyTableHead}>
          <TableRow >
            <TableCell align='center'><BoldWithColor>№</BoldWithColor></TableCell>
            <TableCell><BoldWithColor>Наименование показателей</BoldWithColor></TableCell>
            <TableCell align="center"><BoldWithColor>{yearFirstDate}</BoldWithColor></TableCell>
            <TableCell align="center"><BoldWithColor>{monthFirstDate}</BoldWithColor></TableCell>
            <TableCell align="center"><BoldWithColor>{selectedDate}</BoldWithColor></TableCell>
            <TableCell align="center"><BoldWithColor>Ежемесячная разница</BoldWithColor></TableCell>
            <TableCell align="center"><BoldWithColor>Ежемесячная разница (%)</BoldWithColor></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any, index: number) => (
            <StyledTableRow key={index}>
              <TableCell align="center"><b>{row.count}</b></TableCell>
              <TableCell component="th" scope="row">
                {row.isTableHead ? <b>{row.indicator_name}</b> : <>{row.indicator_name}</>}
              </TableCell>
              <TableCell align="center">{
                                    row.isTableHead ?
                                        <b>{formatNumber(row.yearBegin)}</b> :
                                        <>{formatNumber(row.yearBegin).includes('-') ?
                                            <Typography variant='caption' component='b' className={classes.down}>
                                                ({(formatNumber(row.yearBegin).slice(1))})
                                            </Typography> :
                                            formatNumber(row.yearBegin, true)}</>
              }</TableCell>
              <TableCell align="center">{
                                    row.isTableHead ?
                                        <b>{formatNumber(row.monthBegin)}</b> :
                                        <>{formatNumber(row.monthBegin).includes('-') ?
                                        <Typography variant='caption' component='b' className={classes.down}>
                                            ({formatNumber(row.monthBegin).slice(1)})
                                        </Typography> :
                                        formatNumber(row.monthBegin, true)}</>
              }</TableCell>
              <TableCell align="center">{
                                    row.isTableHead ?
                                        <b>{formatNumber(row.selectedDate)}</b> :
                                        <>{formatNumber(row.selectedDate).includes('-') ?
                                        <Typography variant='caption' component='b' className={classes.down}>
                                            ({formatNumber(row.selectedDate).slice(1)})
                                        </Typography> :
                                        formatNumber(row.selectedDate, true)}</>
              }</TableCell>
              <TableCell align="center">
                {formatNumber(row.differ).includes('-') ?
                                        <Typography variant='caption' component='b' className={classes.down}>
                                            ({formatNumber(row.differ).slice(1)})
                                        </Typography> :
                                        formatNumber(row.differ, true)
                }
              </TableCell>
              <TableCell align="center">{row.differ_percent}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default memo(MainIndicatorsTable)
