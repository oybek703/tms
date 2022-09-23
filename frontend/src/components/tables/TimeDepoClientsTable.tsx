import React, { memo } from 'react'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import { TableBody } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
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
            <TableRow hover key={uuid()}>
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
