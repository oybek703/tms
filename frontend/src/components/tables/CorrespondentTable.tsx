import React, { memo } from 'react'
import makeStyles from '@mui/styles/makeStyles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { formatNumber, formatOneDate } from '../../utils'
import TableCap from '../UI/helpers/TableCap'
import FormattedCell from '../UI/helpers/FormattedCell/FormattedCell'

import ExportButton from '../UI/Layout/ExportButton'
import BoldWithColor from '../UI/helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'

const useStyles = makeStyles(theme => ({
  noWrap: theme.mixins.noWrap,
  stickyTableHead: theme.mixins.stickyTableHead
}))

const RenderedCorrespondentTable = function({ currentState = false, currencyRate = [],
  totalCash = [], interbankDeposits = [] }) {
  const { reportDate } = useTypedSelector(state => state.date)
  const classes = useStyles()
  return (
    <TableContainer component={Paper}>
      <ExportButton
        id={`correspondent-${currentState ? 'realtime' : formatOneDate(reportDate)}`}/>
      <Table tableexport-key={`correspondent-${currentState ?
                'realtime' :
                formatOneDate(reportDate)}`}
      id={`correspondent-${currentState ? 'realtime' : formatOneDate(
          reportDate)}`}
      size="small" aria-label="a dense table">
        <TableCap rows={11} text={'млн. сум'}/>
        <TableHead className={classes.stickyTableHead}>
          <TableRow>
            <TableCell align='center'><BoldWithColor>№</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Наименование</BoldWithColor></TableCell>
            <TableCell align="center"><BoldWithColor>UZS</BoldWithColor></TableCell>
            <TableCell align="center"><BoldWithColor>CNY</BoldWithColor></TableCell>
            <TableCell align="center"><BoldWithColor>JPY</BoldWithColor></TableCell>
            <TableCell align="center"><BoldWithColor>KZT</BoldWithColor></TableCell>
            <TableCell align="center"><BoldWithColor>RUB</BoldWithColor></TableCell>
            <TableCell align="center"><BoldWithColor>CHF</BoldWithColor></TableCell>
            <TableCell align="center"><BoldWithColor>GBP</BoldWithColor></TableCell>
            <TableCell align="center"><BoldWithColor>USD</BoldWithColor></TableCell>
            <TableCell align="center"><BoldWithColor>EUR</BoldWithColor></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currencyRate.map((row: any, i: number) => (
            <TableRow hover key={`${row.state}+${i}`}>
              <TableCell align='center'>{row['isTableHead'] ?
                                <b>{row.count}</b> : row.count}</TableCell>
              <TableCell align='left'>{row['isTableHead'] ?
                                <b>{row.state}</b> : row.state}</TableCell>
              <TableCell className={classes.noWrap}
                align="center">{row['isTableHead'] ?
                                <b>{formatNumber(row.UZS, 'e')}</b> : formatNumber(
                                    row.UZS, 'e')}</TableCell>
              {i !== 1 ?
                                <>
                                  <TableCell className={classes.noWrap}
                                    align="center"><b>{formatNumber(row.CNY)}</b></TableCell>
                                  <TableCell className={classes.noWrap}
                                    align="center"><b>{formatNumber(row.JPY)}</b></TableCell>
                                  <TableCell className={classes.noWrap}
                                    align="center"><b>{formatNumber(row.KZT)}</b></TableCell>
                                  <TableCell className={classes.noWrap}
                                    align="center"><b>{formatNumber(row.RUB)}</b></TableCell>
                                  <TableCell className={classes.noWrap}
                                    align="center"><b>{formatNumber(row.CHF)}</b></TableCell>
                                  <TableCell className={classes.noWrap}
                                    align="center"><b>{formatNumber(row.GBP)}</b></TableCell>
                                  <TableCell className={classes.noWrap}
                                    align="center"><b>{formatNumber(row.USD)}</b></TableCell>
                                  <TableCell className={classes.noWrap}
                                    align="center"><b>{formatNumber(row.EUR)}</b></TableCell>
                                </> :
                                <>
                                  <TableCell align="center"><FormattedCell number={row.CNY}/></TableCell>
                                  <TableCell align="center"><FormattedCell number={row.JPY}/></TableCell>
                                  <TableCell align="center"><FormattedCell number={row.KZT}/></TableCell>
                                  <TableCell align="center"><FormattedCell number={row.RUB}/></TableCell>
                                  <TableCell align="center"><FormattedCell number={row.CHF}/></TableCell>
                                  <TableCell align="center"><FormattedCell number={row.GBP}/></TableCell>
                                  <TableCell align="center"><FormattedCell number={row.USD}/></TableCell>
                                  <TableCell align="center"><FormattedCell number={row.EUR}/></TableCell>

                                </>
              }
            </TableRow>
          ))}
          {[totalCash, interbankDeposits].map((arr: any) => arr.map((row: any, i: number) => (
            <TableRow hover key={`${row.state}+${i}`}>
              <TableCell align='center'>{row['isTableHead'] ?
                                    <b>{row.count}</b> : row.count}</TableCell>
              <TableCell align='left'>{row['isTableHead'] ?
                                    <b>{row.state}</b> : row.state}</TableCell>
              <TableCell className={classes.noWrap}
                align="center">{row['isTableHead'] ?
                                    <b>{formatNumber(row.UZS, true)}</b> : formatNumber(row.UZS, true)}</TableCell>
              <TableCell className={classes.noWrap}
                align="center">{row['isTableHead'] ?
                                    <b>{formatNumber(row.CNY, true)}</b> : formatNumber(row.CNY, true)}</TableCell>
              <TableCell className={classes.noWrap}
                align="center">{row['isTableHead'] ?
                                    <b>{formatNumber(row.JPY, true)}</b> : formatNumber(row.JPY, true)}</TableCell>
              <TableCell className={classes.noWrap}
                align="center">{row['isTableHead'] ?
                                    <b>{formatNumber(row.KZT, true)}</b> : formatNumber(row.KZT, true)}</TableCell>
              <TableCell className={classes.noWrap}
                align="center">{row['isTableHead'] ?
                                    <b>{formatNumber(row.RUB, true)}</b> : formatNumber(row.RUB, true)}</TableCell>
              <TableCell className={classes.noWrap}
                align="center">{row['isTableHead'] ?
                                    <b>{formatNumber(row.CHF, true)}</b> : formatNumber(row.CHF, true)}</TableCell>
              <TableCell className={classes.noWrap}
                align="center">{row['isTableHead'] ?
                                    <b>{formatNumber(row.GBP, true)}</b> : formatNumber(row.GBP, true)}</TableCell>
              <TableCell className={classes.noWrap}
                align="center">{row['isTableHead'] ?
                                    <b>{formatNumber(row.USD, true)}</b> : formatNumber(row.USD, true)}</TableCell>
              <TableCell className={classes.noWrap}
                align="center">{row['isTableHead'] ?
                                    <b>{formatNumber(row.EUR, true)}</b> : formatNumber(row.EUR, true)}</TableCell>
            </TableRow>
          ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

interface CorrespondentTableProps {
    rows: any
    currentState: boolean
}

const CorrespondentTable: React.FC<CorrespondentTableProps> = function({ rows, currentState = false }) {
  const { currencyRate = [], totalCash = [], interbankDeposits = [] } = rows
  return (
    <RenderedCorrespondentTable currencyRate={currencyRate} currentState={currentState}
      interbankDeposits={interbankDeposits} totalCash={totalCash}/>
  )
}

export default memo(CorrespondentTable)
