import React from 'react'
import { Table, TableBody, TableHead, TableRow } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import TableCell from '@mui/material/TableCell'
import FormattedCell from '../../../helpers/FormattedCell/FormattedCell'
import { v4 as uuid } from 'uuid'
import { formatNumber } from '../../../../../utils'
import BoldWithColor from '../../../helpers/BoldWithColor'

const useStyles = makeStyles(theme => ({
  noWrap: theme.mixins.noWrap,
  stickyTableHead: theme.mixins.stickyTableHead
}))

const currencyOrder = ['USD', 'EUR', 'RUB', 'GBP', 'CHF', 'JPY', 'KZT', 'CNY']

interface DashboardCurrencyRatesProps {
    cbRate: any
}

function CurrencyTableHead() {
  const classes = useStyles()
  return <TableHead className={classes.stickyTableHead}>
    <TableRow>
      <TableCell align='center'><BoldWithColor>Валюта</BoldWithColor></TableCell>
      <TableCell align='center'><BoldWithColor>Курс</BoldWithColor></TableCell>
      <TableCell align='center'><BoldWithColor>Изм.</BoldWithColor></TableCell>
    </TableRow>
  </TableHead>
}

export const DashboardCurrencyRates: React.FC<DashboardCurrencyRatesProps> = ({ cbRate = [] }) => {
  return (
    <Table size='small'>
      <CurrencyTableHead/>
      <TableBody>
        {currencyOrder.map(currName => {
          const row = cbRate.find((curr: any) => curr['nominal'] === `1 ${currName}`)
          return <TableRow hover key={uuid()}>
            <TableCell align='center'>{(row || {})['nominal']}</TableCell>
            <TableCell align='center'>{formatNumber((row || {})['equival'])}</TableCell>
            <TableCell align='center'><FormattedCell number={(row || {})['differ']}/></TableCell>
          </TableRow>
        })}
      </TableBody>
    </Table>
  )
}

export const ExternalCurrencyRates = ({ rates = [] }) => {
  const classes = useStyles()
  return (
    <Table size='small' style={{ height: '100%' }}>
      <TableHead className={classes.stickyTableHead}>
        <TableRow>
          <TableCell align='center'><BoldWithColor>Валюта</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>Покупка</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>Пок. изм.</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>Продажа</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>Про. изм.</BoldWithColor></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {currencyOrder.map(currName => {
          const row: any = rates.find(curr => curr['nominal'] === `1 ${currName}`) || {}
          return <TableRow hover key={uuid()}>
            <TableCell align='center'>{(row || {})['nominal']}</TableCell>
            <TableCell className={classes.noWrap}
              align='center'>{formatNumber(+(row || {})['rateParch'] || 0, true)}</TableCell>
            <TableCell align='center'><FormattedCell dashForZero
              number={(row || {})['rateParchDiffer']}/></TableCell>
            <TableCell className={classes.noWrap}
              align='center'>{formatNumber(+(row || {})['rateSal'] || 0, true)}</TableCell>
            <TableCell align='center'><FormattedCell dashForZero number={(row || {})['rateSalDiffer']}/></TableCell>
          </TableRow>
        })}
      </TableBody>
    </Table>
  )
}
