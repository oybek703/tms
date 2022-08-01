import React, { memo } from 'react'
import TableContainer from '@material-ui/core/TableContainer'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { makeStyles, TableBody } from '@material-ui/core'
import { v4 as uuid } from 'uuid'
import TableCap from '../UI/helpers/TableCap'
import { formatNumber, formatOneDate } from '../../utils'
import ExportButton from '../UI/Layout/ExportButton'
import BoldWithColor from '../UI/helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'

const useStyles = makeStyles((theme) => ({
  noWrap: theme.mixins.noWrap,
  stickyTableHead: theme.mixins.stickyTableHead
}))

const TimeDepoClientsTable: React.FC<{rows: any}> = function({ rows = [] }) {
  const classes = useStyles()
  const { reportDate } = useTypedSelector((state) => state.date)
  return (
    <TableContainer component={Paper}>
      <ExportButton id={`time-depo-clients-${formatOneDate(reportDate)}`}/>
      <Table size='small' id={`time-depo-clients-${formatOneDate(reportDate)}`}>
        <TableCap rows={9} text={'в номинале'}/>
        <TableHead className={classes.stickyTableHead}>
          <TableRow>
            <TableCell align='center'><BoldWithColor>Наименование филиала</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Балансовый Счет</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Наименование организации разместившей депозит</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Дата размещения по договору</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Дата погашения по договору</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Валюта счета</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Сумма по договору <br/>(<small><i>в номинале</i></small>)</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Сумма по договору <br/>(<small><i>в сумовом эквиваленте</i></small>)</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>% ставка</BoldWithColor></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r: any) => (
            <TableRow key={uuid()}>
              <TableCell>{r['FILIAL_NAME']}</TableCell>
              <TableCell align='center'>{r['CODE_COA']}</TableCell>
              <TableCell>{r['CLIENT_NAME']}</TableCell>
              <TableCell align='center'>{r['DATE_BEGIN']}</TableCell>
              <TableCell align='center'>{r['DATE_END']}</TableCell>
              <TableCell align='center'>{r['CURRENCY_CODE']}</TableCell>
              <TableCell align='center' className={classes.noWrap}>{formatNumber(r['SALDO_OUT'])}</TableCell>
              <TableCell align='center' className={classes.noWrap}>{formatNumber(r['SALDO_EQUIVALENT_OUT'])}</TableCell>
              <TableCell align='center'>{formatNumber(r['PERCENT'])}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default memo(TimeDepoClientsTable)
