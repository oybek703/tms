import React, { Fragment, useCallback, useState } from 'react'
import {
  makeStyles,
  Paper,
  TableBody,
  TableContainer,
  TableRow
} from '@material-ui/core'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import BoldWithColor from '../../UI/helpers/BoldWithColor'
import { v4 as uuid } from 'uuid'
import { formatNumber } from '../../../utils'
import ProgressBar from '../../UI/Layout/ProgressBar'
import ButtonTabs from '../../UI/Layout/Tabs/ButtonsTab'

const useStyles = makeStyles(theme => ({
  noWrap: theme.mixins.noWrap,
  stickyTableHead: theme.mixins.stickyTableHead,
  stickyCol: {
    // ...theme.mixins.stickyCol,
    // zIndex: 100,
    // color: '#fff'
  },
  exceeded: {
    color: 'red'
  },
  blueBackground: theme.mixins.blueBackground
}))

function ForeignBankTable({ rows = [] }) {
  const classes = useStyles()
  return <TableContainer component={Paper}>
    <Table size='small'>
      <TableHead className={classes.stickyTableHead}>
        <TableRow>
          <TableCell
              align='center'><BoldWithColor>№</BoldWithColor></TableCell>
          <TableCell align='center'>
            <BoldWithColor>Наименование</BoldWithColor>
          </TableCell>
          <TableCell
              align='center'><BoldWithColor>Остаток</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>Лимить -
            22%</BoldWithColor></TableCell>
          <TableCell
              align='center'><BoldWithColor>Разница</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>(%)
            лимита</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>Лимить -
            24%</BoldWithColor></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => <TableRow key={uuid()}>
          <TableCell align='center'>
            <b>{index + 1}</b>
          </TableCell>
          <TableCell
              className={classes.noWrap}><b>{row['NAME']}</b></TableCell>
          <TableCell align='center'
                     className={classes.noWrap}>{formatNumber(
              row['SALDO_EQUIVAL_OUT'])}</TableCell>
          <TableCell align='center'
                     className={classes.noWrap}>{formatNumber(
              row['FOREIGN_CURRENCY_22'])}</TableCell>
          <TableCell align='center'
                     className={classes.noWrap}>{formatNumber(
              row['DIFFER'])}</TableCell>
          <TableCell align='center' className={classes.noWrap}>
            {row['FOR_PERCENT'] === 'no_limit'
                ? <b><i>Лимит не установлен</i>.</b>
                : row['FOR_PERCENT'] === 'exceeded'
                    ? <b className={classes.exceeded}><i>Лимит нарушен.</i></b>
                    : <ProgressBar value={Number(row['FOR_PERCENT']).toFixed(2)}/>}
          </TableCell>
          <TableCell align='center'
                     className={classes.noWrap}>{formatNumber(
              row['FOREIGN_CURRENCY_24'])}</TableCell>
        </TableRow>)}
      </TableBody>
    </Table>
  </TableContainer>
}

const titles = [
  { title: 'Локальные банки', code: 'local' },
  { title: 'Иностранные банки', code: 'foreign' }
]

const BankLimits = ({ bankLimits = {} }) => {
  let {foreignBanks = [], localBanks = []} = bankLimits
  const classes = useStyles()
  const [expanded, setExpanded] = useState('local')
  const handleChange = useCallback(code => setExpanded(code), [])
  if(JSON.stringify(localBanks) === JSON.stringify({})) localBanks = []
  return (
    <Fragment>
      <ButtonTabs handleChange={handleChange} active={expanded}
                  titles={titles}/>
      {
        expanded === 'local'
            ? <TableContainer component={Paper}>
              <Table size='small'>
                <TableHead className={classes.stickyTableHead}>
                  <TableRow>
                    <TableCell rowSpan={2}
                        align='center'><BoldWithColor>№</BoldWithColor></TableCell>
                    <TableCell rowSpan={2} align='center' className={`${classes.stickyCol} ${classes.stickyTableHead}`}>
                      <BoldWithColor>Наименование</BoldWithColor>
                    </TableCell>
                    <TableCell align='center' colSpan={2}><BoldWithColor>Остаток</BoldWithColor></TableCell>
                    <TableCell align='center' colSpan={2}><BoldWithColor>Лимит - 22%</BoldWithColor></TableCell>
                    <TableCell align='center' colSpan={2}><BoldWithColor>Разница</BoldWithColor></TableCell>
                    <TableCell align='center' colSpan={2}><BoldWithColor>(%) лимита</BoldWithColor></TableCell>
                    <TableCell align='center' colSpan={2}><BoldWithColor>Лимит - 24%</BoldWithColor></TableCell>
                  </TableRow>
                  <TableRow>
                    {Array(5).fill('').map(_ => <Fragment key={uuid()}>
                      <TableCell align='center'><BoldWithColor>Нац. валюта</BoldWithColor></TableCell>
                      <TableCell align='center'><BoldWithColor>Иност. валюта</BoldWithColor></TableCell>
                    </Fragment>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {localBanks.map((row, index) => <TableRow key={uuid()}>
                    <TableCell align='center'><b>{index+1}</b></TableCell>
                    <TableCell><b>{row['NAME']}</b></TableCell>
                    <TableCell align='center' className={classes.noWrap}>{formatNumber(row['NAT_CURR'])}</TableCell>
                    <TableCell align='center' className={classes.noWrap}>{formatNumber(row['FOR_CURR'])}</TableCell>
                    <TableCell align='center' className={classes.noWrap}>{formatNumber(row['NATIONAL_CURRENCY_22'])}</TableCell>
                    <TableCell align='center' className={classes.noWrap}>{formatNumber(row['FOREIGN_CURRENCY_22'])}</TableCell>
                    <TableCell align='center' className={classes.noWrap}>{formatNumber(row['DIFFER_NAT'])}</TableCell>
                    <TableCell align='center' className={classes.noWrap}>{formatNumber(row['DIFFER_FOR'])}</TableCell>
                    <TableCell align='center' className={classes.noWrap}>
                      {row['NAT_CURR_PERCENT'] === 'no_limit'
                          ? <b><i>Лимит не установлен</i>.</b>
                          : row['NAT_CURR_PERCENT'] === 'exceeded'
                              ? <b className={classes.exceeded}><i>Лимит нарушен.</i></b>
                              : <ProgressBar value={Number(row['NAT_CURR_PERCENT']).toFixed(2)}/>}
                    </TableCell>
                    <TableCell align='center' className={classes.noWrap}>
                      {row['FOR_CURR_PERCENT'] === 'no_limit'
                          ? <b><i>Лимит не установлен</i>.</b>
                          : row['FOR_CURR_PERCENT'] === 'exceeded'
                              ? <b className={classes.exceeded}><i>Лимит нарушен.</i></b>
                              : <ProgressBar value={Number(row['FOR_CURR_PERCENT']).toFixed(2)}/>}
                    </TableCell>
                    <TableCell align='center' className={classes.noWrap}>{formatNumber(row['NATIONAL_CURRENCY_24'])}</TableCell>
                    <TableCell align='center' className={classes.noWrap}>{formatNumber(row['FOREIGN_CURRENCY_24'])}</TableCell>
                  </TableRow>)}
                </TableBody>
              </Table>
            </TableContainer>
          : <ForeignBankTable rows={foreignBanks} />
      }
    </Fragment>
  )
}

export default BankLimits