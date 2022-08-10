import React, { Fragment, memo, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { formatNumber, formatOneDate } from '../../utils'

import TableCap from '../UI/helpers/TableCap'
import ExportButton from '../UI/Layout/ExportButton'
import BoldWithColor from '../UI/helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'
import { v4 as uuid } from 'uuid'

const useStyles = makeStyles((theme) => ({
  tableCaption: {
    backgroundColor: 'red',
    color: 'white',
    padding: '2px 10px',
    whiteSpace: 'nowrap',
    width: 300,
    fontSize: '.9em'
  },
  divider: {
    marginTop: 20
  },
  smallCaption: {
    padding: 10,
    fontSize: 14
  },
  noWrap: theme.mixins.noWrap,
  stickyTableHead: theme.mixins.stickyTableHead,
  blueBackground: theme.mixins.blueBackground
}))

interface LiqPointersTableProps {
  rows: any
  currentState: boolean
}

const singleColouredRow = 'Доля высоколиквидных активов в %'

const LiqPointersTable: React.FC<LiqPointersTableProps> = function({ rows = {}, currentState = false }) {
  const { liquidityAssets = [], obligations = [] } = rows
  const classes = useStyles()
  const { reportDate } = useTypedSelector((state) => state.date)
  const renderTableBody = useCallback((tableData) => (<TableBody>
    {tableData.map((row: any, i: number) => (
      <Fragment key={uuid()}>
        {row.state === singleColouredRow ?
          <TableRow style={{ backgroundColor: '#b4c6cf' }}>
            <TableCell align='center'><b>{row.count}</b></TableCell>
            <TableCell ><b>{row.state}</b></TableCell>
            <TableCell align='center' className={classes.noWrap}>
              <b>{formatNumber(row.total)}</b>
            </TableCell>
            <TableCell align='center' className={classes.noWrap}>
              <b>{formatNumber(row.nat_curr)}</b>
            </TableCell>
            <TableCell align='center' className={classes.noWrap}>
              <b>{formatNumber(row.for_curr)}</b>
            </TableCell>
            <TableCell align='center' className={classes.noWrap}>
              <b>{formatNumber(row.usa_dollar)}</b>
            </TableCell>
            <TableCell align='center' className={classes.noWrap}>
              <b>{formatNumber(row.evro)}</b>
            </TableCell>
          </TableRow> :
        <TableRow hover>
          <TableCell align='center'>{row['isTableHead'] ?
              <b>{row.count}</b> :
              row.count}</TableCell>
          <TableCell align='left'>{row['isTableHead'] ?
              <b>{row.state}</b> :
              row.state}</TableCell>
          <TableCell className={classes.noWrap} align='center'>
            {row['isTableHead'] ?
                <b>{formatNumber(row.total)}</b> :
                formatNumber(row.total)}
          </TableCell>
          <TableCell className={classes.noWrap} align='center'>
            {row['isTableHead'] ?
                <b>{formatNumber(row['nat_curr'], true)}</b> :
                formatNumber(row['nat_curr'], true)}
          </TableCell>
          <TableCell className={classes.noWrap} align='center'>
            {row['isTableHead'] ?
                <b>{formatNumber(row['for_curr'], true)}</b> :
                formatNumber(row['for_curr'], true)}
          </TableCell>
          <TableCell className={classes.noWrap} align='center'>
            {row['isTableHead'] ?
                <b>{formatNumber(row['usa_dollar'], true)}</b> :
                formatNumber(row['usa_dollar'], true)}
          </TableCell>
          <TableCell className={classes.noWrap} align='center'>
            {row['isTableHead'] ?
                <b>{formatNumber(row['evro'], true)}</b> :
                formatNumber(row['evro'], true)}
          </TableCell>
        </TableRow>}
      </Fragment>
    ))}
  </TableBody>), [classes.noWrap])
  return (
    <TableContainer component={Paper}>
      <ExportButton
        id={`liquidity-pointers-${currentState ? 'realtime' : formatOneDate(
            reportDate)}`}/>
      <Table size="small"
        id={`liquidity-pointers-${currentState ?
               'realtime' :
               formatOneDate(reportDate)}`}
        tableexport-key={`liquidity-pointers-${currentState ?
               'realtime' :
               formatOneDate(reportDate)}`}
        aria-label="a dense table">
        <TableCap rows={7} text={'млн.сум'}/>
        <TableHead className={classes.stickyTableHead}>
          <TableRow>
            <TableCell
              align='center'><BoldWithColor>№</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Статья
              баланса</BoldWithColor></TableCell>
            <TableCell
              align='center'><BoldWithColor>Итого</BoldWithColor></TableCell>
            <TableCell
              align='center'><BoldWithColor>Национальная <br/> валюта</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Иностранная валюта <br/> в
              суммовом эквиваленте</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Долл.
              США</BoldWithColor></TableCell>
            <TableCell
              align='center'><BoldWithColor>Евро</BoldWithColor></TableCell>
          </TableRow>
        </TableHead>
        {/* ЛИКВИДНЫЕ АКТИВЫ*/}
        {renderTableBody(liquidityAssets)}
        {/* ОБЯЗАТЕЛЬСТВА ДО ВОСТРЕБОВАНИЯ*/}
        {renderTableBody(obligations)}
      </Table>
    </TableContainer>
  )
}

export default memo(LiqPointersTable)
