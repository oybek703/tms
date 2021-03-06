import React, { useCallback } from 'react'
import { makeStyles, Paper, Table, TableBody, TableHead, TableRow } from '@material-ui/core'
import TableCell from '@material-ui/core/TableCell'
import { v4 as uuid } from 'uuid'
import { formatNumber } from '../../../../../utils'
import PercentIndicator from './PercentIndicator'

const useStyles = makeStyles((theme) => ({
  noWrap: theme.mixins.noWrap
}))

const currencyOrder = ['USD', 'EUR', 'JPY', 'GBP', 'KZT', 'RUB', 'CHF', 'CNY']

const Position = ({ position = [] }) => {
  const classes = useStyles()
  const reOrderedPosition = currencyOrder.map((title) => (position.find((currency) => (currency || {})['NAME'] === title)))
  const totalPercent = useCallback(function() {
    return position.reduce((acc, val) => acc += val['PERCENT'], 0)
  }, [position])
  const totalSumEquivalent = useCallback(function() {
    return position.reduce((acc, val) => acc += val['SUM_EQUIVAL'], 0)
  }, [position])
  return (
    <Paper style={{ minHeight: 372 }}>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell align='center'><b>Валюта</b></TableCell>
            <TableCell align='center'><b>Позиция</b></TableCell>
            <TableCell align='center'><b>%</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reOrderedPosition.map((row: any = {}) => (<TableRow key={uuid()}>
            <TableCell align='center'>{row['NAME']}</TableCell>
            <TableCell style={{ color: '#009c34' }} align='center'>
              {formatNumber(row['EQUIVAL'])}
            </TableCell>
            <TableCell align='center'>
              <PercentIndicator number={row['PERCENT']}/>
            </TableCell>
          </TableRow>))}
          <TableRow>
            <TableCell align='center'><b>Суммарная величина позиций</b></TableCell>
            <TableCell align='center' className={classes.noWrap} style={{ color: '#009c34' }}>
              <b>{formatNumber(totalSumEquivalent())}</b>
            </TableCell>
            <TableCell align='center'>
              <PercentIndicator total number={totalPercent()}/>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}

export default Position
