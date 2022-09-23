import React, { Fragment, useCallback, useState } from 'react'
import { Paper, TableBody, TableContainer, TableRow } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import BoldWithColor from '../../../helpers/BoldWithColor'
import { v4 as uuid } from 'uuid'
import { formatNumber } from '../../../../../utils'
import ProgressBar from '../../ProgressBar'
import ButtonTabs from '../../Tabs/ButtonsTab'
import Grid from '@mui/material/Grid'
import LimitsMenu from './LimitsMenu'

const useStyles = makeStyles((theme) => ({
  noWrap: theme.mixins.noWrap,
  stickyTableHead: theme.mixins.stickyTableHead,
  exceeded: {
    color: 'red'
  },
  blueBackground: theme.mixins.blueBackground
}))

interface NoWrapCellProps {
  celldata: any
  colSpan?: number
  style?: any
}

const NoWrapCell: React.FC<NoWrapCellProps> = (props) => {
  const classes = useStyles()
  const { celldata = 0, colSpan = 0 } = props
  return <TableCell colSpan={colSpan} {...props} align='center'
    className={classes.noWrap}>
    {typeof celldata === 'number' ? formatNumber(celldata) : celldata}
  </TableCell>
}

function ProgressOrText({ celldata = '0', showNumber = false }) {
  const classes = useStyles()
  return (
    celldata === 'no_limit' ?
      <i>Лимит не установлен.</i> :
      celldata === 'exceeded' ?
        <b className={classes.exceeded}><i>Лимит нарушен.</i></b> :
        <ProgressBar showNumber={showNumber} value={+Number(celldata).toFixed(2)}/>
  )
}

function BankLimitsTableHead({ localBanks = false }) {
  const classes = useStyles()
  return (
    <TableHead className={classes.stickyTableHead}>
      <TableRow>
        <TableCell
          align='center' rowSpan={localBanks ?
          2 :
          0}><BoldWithColor>№</BoldWithColor></TableCell>
        <TableCell align='center' rowSpan={localBanks ? 2 : 0}>
          <BoldWithColor>Наименование</BoldWithColor>
        </TableCell>
        <TableCell
          align='center' colSpan={localBanks ? 2 : 0}><BoldWithColor>Остаток
          корр. счетов</BoldWithColor></TableCell>
        <TableCell align='center'
          colSpan={localBanks ? 2 : 0}><BoldWithColor>Лимит -
          22%</BoldWithColor></TableCell>
        <TableCell
          align='center' colSpan={localBanks ?
          2 :
          0}><BoldWithColor>Разница</BoldWithColor></TableCell>
        <TableCell align='center'
          colSpan={localBanks ? 2 : 0}><BoldWithColor>(%)
          лимита</BoldWithColor></TableCell>
        <TableCell align='center'
          colSpan={localBanks ? 2 : 0}><BoldWithColor>Лимит -
          24%</BoldWithColor></TableCell>
      </TableRow>
      {localBanks && <TableRow>
        {Array(5).fill('').map((_) => <Fragment key={uuid()}>
          <TableCell align='center'><BoldWithColor>Нац.
            валюта</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>Иност.
            валюта</BoldWithColor></TableCell>
        </Fragment>)}
      </TableRow>}
    </TableHead>
  )
}

interface ForeignBanksProps {
  rows: ForeignBanks[]
}

const ForeignBankTable: React.FC<ForeignBanksProps> = ({ rows = [] }) => {
  const classes = useStyles()
  if (JSON.stringify(rows) === JSON.stringify({})) rows = []
  return (<TableContainer component={Paper}>
    <Table size='small'>
      <BankLimitsTableHead/>
      <TableBody>
        {rows.map((row, index) => <TableRow hover key={uuid()}>
          <TableCell align='center'><b>{index + 1}</b></TableCell>
          <TableCell
            className={classes.noWrap}><b>{row['NAME']}</b></TableCell>
          <NoWrapCell celldata={row['SALDO_EQUIVAL_OUT']}/>
          <NoWrapCell celldata={row['FOREIGN_CURRENCY_22']}/>
          <NoWrapCell celldata={row['DIFFER_22']}/>
          <NoWrapCell celldata={<Fragment>
            {+row['FOR_PERCENT_22'] >= 100 ?
              <Grid container justifyContent='space-between' alignItems='center'>
                <Grid style={{ width: '99%' }}>
                  <ProgressOrText celldata={row['FOR_PERCENT_22']}/>
                </Grid>
                <Grid style={{ width: '1%' }}>
                  <LimitsMenu innerData={
                    <>
                      <TableHead>
                        <TableRow>
                          <TableCell><b>Процент лимита - 22%</b></TableCell>
                          <TableCell><b>Процент лимита - 24%</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <NoWrapCell celldata={<ProgressOrText showNumber celldata={row['FOR_PERCENT_22']}/>}/>
                          <NoWrapCell celldata={<ProgressOrText showNumber celldata={row['FOR_PERCENT_24']}/>}/>
                        </TableRow>
                      </TableBody>
                    </>
                  }/>
                </Grid>
              </Grid>:
              <ProgressOrText celldata={row['FOR_PERCENT_22']}/>}
          </Fragment>}/>
          <NoWrapCell celldata={row['FOREIGN_CURRENCY_24']}/>
        </TableRow>)}
      </TableBody>
    </Table>
  </TableContainer>)
}

interface LocalBanksProps {
  rows: LocalBanks[]
  nationalBank: LocalBanks[]
}

const LocalBanksTable: React.FC<LocalBanksProps> = ({ rows = [], nationalBank = [] }) => {
  if (JSON.stringify(rows) === JSON.stringify({})) rows = []
  if (JSON.stringify(nationalBank) === JSON.stringify({})) nationalBank = []
  return <TableContainer component={Paper}>
    <Table size='small'>
      <BankLimitsTableHead localBanks/>
      <TableBody>
        {nationalBank.map((row) => <TableRow hover key={uuid()}>
          <TableCell align='center'><b>1</b></TableCell>
          <TableCell><b>{row['NAME']}</b></TableCell>
          <NoWrapCell colSpan={2} celldata={row['SALDO_EQUIVAL_OUT']}/>
          <NoWrapCell colSpan={2} celldata={row['NATIONAL_CURRENCY_22']}/>
          <NoWrapCell colSpan={2} celldata={row['DIFFER']}/>
          <NoWrapCell colSpan={2} celldata={<ProgressOrText
            celldata={row['NAT_PERCENT']}/>}/>
          <NoWrapCell colSpan={2} celldata={row['NATIONAL_CURRENCY_24']}/>
        </TableRow>)}
        {rows.map((row, index) => <TableRow hover key={uuid()}>
          <TableCell align='center'><b>{index + 2}</b></TableCell>
          <TableCell><b>{row['NAME']}</b></TableCell>
          <NoWrapCell celldata={row['NAT_CURR']}/>
          <NoWrapCell celldata={row['FOR_CURR']}/>
          <NoWrapCell celldata={row['NATIONAL_CURRENCY_22']}/>
          <NoWrapCell celldata={row['FOREIGN_CURRENCY_22']}/>
          <NoWrapCell celldata={row['DIFFER_NAT']}/>
          <NoWrapCell celldata={row['DIFFER_FOR']}/>
          <NoWrapCell celldata={<ProgressOrText
            celldata={row['NAT_CURR_PERCENT']}/>}/>
          <NoWrapCell celldata={<ProgressOrText
            celldata={row['FOR_CURR_PERCENT']}/>}/>
          <NoWrapCell celldata={row['NATIONAL_CURRENCY_24']}/>
          <NoWrapCell celldata={row['FOREIGN_CURRENCY_24']}/>
        </TableRow>)}
      </TableBody>
    </Table>
  </TableContainer>
}

const titles = [
  { title: 'Локальные банки', code: 'local' },
  { title: 'Иностранные банки', code: 'foreign' }
]

interface ForeignBanks {
  NAME: string
  SALDO_EQUIVAL_OUT: number
  FOREIGN_CURRENCY_22: number
  DIFFER_22: number
  DIFFER_24: number
  FOR_PERCENT_22: string
  FOR_PERCENT_24: string
  FOREIGN_CURRENCY_24: number
}

interface LocalBanks {
  NAME: string
  NAT_CURR: number
  FOR_CURR: string
  NATIONAL_CURRENCY_22: number
  FOREIGN_CURRENCY_22: number
  DIFFER_NAT: number
  DIFFER_FOR: number
  NAT_CURR_PERCENT: string
  FOR_CURR_PERCENT: string
  NATIONAL_CURRENCY_24: number
  FOREIGN_CURRENCY_24: number
  SALDO_EQUIVAL_OUT: number
  DIFFER: number
  NAT_PERCENT: string
}

interface BankLimitsProps {
  bankLimits: {
    foreignBanks: ForeignBanks[]
    localBanks: LocalBanks[]
    nationalBank: LocalBanks[]
  }
}

const BankLimits: React.FC<BankLimitsProps> = ({ bankLimits }) => {
  const { foreignBanks = [], localBanks = [], nationalBank = [] } = bankLimits
  const [expanded, setExpanded] = useState(localStorage.getItem('bankLimitsActiveTab') || 'local')
  const handleChange = useCallback((code) => {
    setExpanded(code)
    localStorage.setItem('bankLimitsActiveTab', code)
  }, [])
  const cForeignBanks = foreignBanks.slice()
  cForeignBanks.forEach((e: ForeignBanks) => {
    if (e.FOR_PERCENT_22 == 'no_limit') {
      foreignBanks.splice(foreignBanks.findIndex((a: object) => a == e), 1)
      foreignBanks.push(e)
    }
  })
  const cLocalBanks = localBanks.slice()
  cLocalBanks.forEach((e: LocalBanks) => {
    if (e.NAT_CURR_PERCENT == 'no_limit' || e.FOR_CURR_PERCENT == 'no_limit') {
      localBanks.splice(localBanks.findIndex((a: object) => a == e), 1)
      localBanks.push(e)
    }
  })
  return (
    <Fragment>
      <ButtonTabs handleChange={handleChange} active={expanded}
        titles={titles}/>
      {
        expanded === 'local' ?
          <LocalBanksTable rows={localBanks}
            nationalBank={nationalBank}/> :
          <ForeignBankTable rows={foreignBanks}/>
      }
    </Fragment>
  )
}

export default BankLimits
