import React, { Fragment, memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import Paper from '@material-ui/core/Paper'
import { formatNumber, formatOneDate } from '../../utils'
import TableRow from '@material-ui/core/TableRow'
import useTypedSelector from '../../hooks/useTypedSelector'
import { TableCell } from '@material-ui/core'
import BoldWithColor from '../UI/helpers/BoldWithColor'
import { v4 as uuid } from 'uuid'

interface RowData {
  code: string
  title: string,
  data: {
    name: string,
    moreOperations: string,
    quick: string,
    safe: string,
    expensiveOrCheap: string,
    saldoOut: number,
    turnoverDebit: number,
    percentDebit: number,
    turnoverCredit: number,
    percentCredit: number,
    import: string,
    export: string,
    accredetiv: string,
    interbankDeposit: string,
    forex: string,
    creditLine: string,
    vostro: string,
    useForPayment: string
  }[]
}

const useStyles = makeStyles((theme) => ({
  noWrap: theme.mixins.noWrap,
  italic: theme.mixins.italic,
  stickyTableHead: theme.mixins.stickyTableHead
}))

interface NostroMatrixTableProps {
  rows: RowData[],
  noData?: boolean
}

function EmptyCell() {
  return <TableCell style={{ background: '#fff', border: 'none' }} rowSpan={2}/>
}

const NostroMatrixTable: React.FC<NostroMatrixTableProps> = function({ rows, noData }) {
  const classes = useStyles()
  const { reportDate } = useTypedSelector((state) => state.date)
  if (noData) return <Fragment/>
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead className={classes.stickyTableHead}>
          <TableRow>
            <TableCell className={classes.noWrap} colSpan={2} rowSpan={2} align='center'>
              <BoldWithColor>Наименование</BoldWithColor>
            </TableCell>
            <EmptyCell/>
            <TableCell className={classes.noWrap} colSpan={4} align='center'>
              <BoldWithColor>Качество обслуживание</BoldWithColor>
            </TableCell>
            <EmptyCell/>
            <TableCell className={classes.noWrap} colSpan={5} align='center'>
              <BoldWithColor>Информация о остатках и оборотах</BoldWithColor>
            </TableCell>
            <EmptyCell/>
            <TableCell className={classes.noWrap} colSpan={7} align='center'>
              <BoldWithColor>Виды операций</BoldWithColor>
            </TableCell>
          </TableRow>
          <TableRow>
            {[
              'больше операций',
              'быстрый',
              'безопасный',
              'дорогой/дешевый',
              `Остаток на ${formatOneDate(reportDate)}`,
              'Оборот Дебет',
              'Доля от д-т об-т.(%)',
              'Оборот Кредит',
              'Доля от кр-т об-т.(%)',
              'Импорт',
              'Експорт',
              'Аккредитив',
              'МБД',
              'FX',
              'Кредитная линия',
              'Востро'
            ].map(title => <TableCell align='center' key={uuid()} className={classes.noWrap}>
              <BoldWithColor>
                {title}
              </BoldWithColor></TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows && rows.map((row, _index) => <Fragment key={uuid()}>
            <TableRow>
              <TableCell colSpan={2} align='center' style={{ fontSize: '1.1em' }}><b>{row.title}</b></TableCell>
              <TableCell style={{ border: 'none' }}/>
              <TableCell colSpan={4}/>
              <TableCell style={{ border: 'none' }}/>
              <TableCell colSpan={5}/>
              <TableCell style={{ border: 'none' }}/>
              <TableCell colSpan={7}/>
            </TableRow>
            {row.data.map((cell, index) => <TableRow key={uuid()}>
              <TableCell align='center'><b>{index + 1}</b></TableCell>
              <TableCell className={classes.noWrap}><b>{cell.name}</b></TableCell>
              <TableCell style={{ border: 'none' }}/>
              <TableCell align='center'>{cell.moreOperations}</TableCell>
              <TableCell align='center'>{cell.quick}</TableCell>
              <TableCell align='center'>{cell.safe}</TableCell>
              <TableCell align='center'>{cell.expensiveOrCheap}</TableCell>
              <TableCell style={{ border: 'none' }}/>
              <TableCell align='center' className={classes.noWrap}>{formatNumber(cell.saldoOut)}</TableCell>
              <TableCell align='center' className={classes.noWrap}>{formatNumber(cell.turnoverDebit)}</TableCell>
              <TableCell align='center' className={classes.noWrap}>{formatNumber(cell.percentDebit)}</TableCell>
              <TableCell align='center' className={classes.noWrap}>{formatNumber(cell.turnoverCredit)}</TableCell>
              <TableCell align='center' className={classes.noWrap}>{formatNumber(cell.percentCredit)}</TableCell>
              <TableCell style={{ border: 'none' }}/>
              <TableCell align='center'>{cell.import}</TableCell>
              <TableCell align='center'>{cell.export}</TableCell>
              <TableCell align='center'>{cell.accredetiv}</TableCell>
              <TableCell align='center'>{cell.interbankDeposit}</TableCell>
              <TableCell align='center'>{cell.forex}</TableCell>
              <TableCell align='center'>{cell.creditLine}</TableCell>
              <TableCell align='center'>{cell.vostro}</TableCell>
            </TableRow>)}
          </Fragment>)}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default memo(NostroMatrixTable)
