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
    exceeded: {
        color: 'red'
    },
    blueBackground: theme.mixins.blueBackground
}))

function NoWrapCell ({ cellData = 0, colSpan = 0 }) {
    const classes = useStyles()
    return <TableCell colSpan={colSpan} align='center'
                      className={classes.noWrap}>
        {typeof cellData === 'number' ? formatNumber(cellData) : cellData}
    </TableCell>
}

function ProgressOrText ({ cellData = '0' }) {
    const classes = useStyles()
    return (
        cellData === 'no_limit'
            ? <i>Лимит не установлен.</i>
            : cellData === 'exceeded'
            ? <b className={classes.exceeded}><i>Лимит нарушен.</i></b>
            : <ProgressBar value={Number(cellData).toFixed(2)}/>
    )
}

function BankLimitsTableHead ({ localBanks = false }) {
    const classes = useStyles()
    return (
        <TableHead className={classes.stickyTableHead}>
            <TableRow>
                <TableCell
                    align='center' rowSpan={localBanks
                    ? 2
                    : 0}><BoldWithColor>№</BoldWithColor></TableCell>
                <TableCell align='center' rowSpan={localBanks ? 2 : 0}>
                    <BoldWithColor>Наименование</BoldWithColor>
                </TableCell>
                <TableCell
                    align='center' colSpan={localBanks
                    ? 2
                    : 0}><BoldWithColor>Остаток</BoldWithColor></TableCell>
                <TableCell align='center'
                           colSpan={localBanks ? 2 : 0}><BoldWithColor>Лимить -
                    22%</BoldWithColor></TableCell>
                <TableCell
                    align='center' colSpan={localBanks
                    ? 2
                    : 0}><BoldWithColor>Разница</BoldWithColor></TableCell>
                <TableCell align='center'
                           colSpan={localBanks ? 2 : 0}><BoldWithColor>(%)
                    лимита</BoldWithColor></TableCell>
                <TableCell align='center'
                           colSpan={localBanks ? 2 : 0}><BoldWithColor>Лимить -
                    24%</BoldWithColor></TableCell>
            </TableRow>
            {localBanks && <TableRow>
                {Array(5).fill('').map(_ => <Fragment key={uuid()}>
                    <TableCell align='center'><BoldWithColor>Нац.
                        валюта</BoldWithColor></TableCell>
                    <TableCell align='center'><BoldWithColor>Иност.
                        валюта</BoldWithColor></TableCell>
                </Fragment>)}
            </TableRow>}
        </TableHead>
    )
}

function ForeignBankTable ({ rows = [] }) {
    const classes = useStyles()
    if (JSON.stringify(rows) === JSON.stringify({})) rows = []
    return (<TableContainer component={Paper}>
      <Table size='small'>
        <BankLimitsTableHead/>
        <TableBody>
          {rows.map((row, index) => <TableRow key={uuid()}>
            <TableCell align='center'><b>{index + 1}</b></TableCell>
            <TableCell
                className={classes.noWrap}><b>{row['NAME']}</b></TableCell>
            <NoWrapCell cellData={row['SALDO_EQUIVAL_OUT']}/>
            <NoWrapCell cellData={row['FOREIGN_CURRENCY_22']}/>
            <NoWrapCell cellData={row['DIFFER']}/>
            <NoWrapCell cellData={<ProgressOrText
                cellData={row['FOR_PERCENT']}/>}/>
            <NoWrapCell cellData={row['FOREIGN_CURRENCY_24']}/>
          </TableRow>)}
        </TableBody>
      </Table>
    </TableContainer>)
}

function LocalBanksTable ({ rows = [], nationalBank = [] }) {
    if (JSON.stringify(rows) === JSON.stringify({})) rows = []
    if (JSON.stringify(nationalBank) === JSON.stringify({})) nationalBank = []
    return <TableContainer component={Paper}>
        <Table size='small'>
            <BankLimitsTableHead localBanks/>
            <TableBody>
                {nationalBank.map(row => <TableRow key={uuid()}>
                  <TableCell align='center'><b>1</b></TableCell>
                  <TableCell><b>{row['NAME']}</b></TableCell>
                  <NoWrapCell colSpan={2} cellData={row['SALDO_EQUIVAL_OUT']}/>
                  <NoWrapCell colSpan={2} cellData={row['NATIONAL_CURRENCY_22']}/>
                  <NoWrapCell colSpan={2} cellData={row['DIFFER']}/>
                  <NoWrapCell colSpan={2} cellData={<ProgressOrText
                      cellData={row['NAT_PERCENT']}/>}/>
                  <NoWrapCell colSpan={2} cellData={row['NATIONAL_CURRENCY_24']}/>
                </TableRow>)}
                {rows.map((row, index) => <TableRow key={uuid()}>
                    <TableCell align='center'><b>{index + 2}</b></TableCell>
                    <TableCell><b>{row['NAME']}</b></TableCell>
                    <NoWrapCell cellData={row['NAT_CURR']}/>
                    <NoWrapCell cellData={row['FOR_CURR']}/>
                    <NoWrapCell cellData={row['NATIONAL_CURRENCY_22']}/>
                    <NoWrapCell cellData={row['FOREIGN_CURRENCY_22']}/>
                    <NoWrapCell cellData={row['DIFFER_NAT']}/>
                    <NoWrapCell cellData={row['DIFFER_FOR']}/>
                    <NoWrapCell cellData={<ProgressOrText
                        cellData={row['NAT_CURR_PERCENT']}/>}/>
                    <NoWrapCell cellData={<ProgressOrText
                        cellData={row['FOR_CURR_PERCENT']}/>}/>
                    <NoWrapCell cellData={row['NATIONAL_CURRENCY_24']}/>
                    <NoWrapCell cellData={row['FOREIGN_CURRENCY_24']}/>
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
    let { foreignBanks = [], localBanks = [], nationalBank = [] } = bankLimits
    const [expanded, setExpanded] = useState('local')
    const handleChange = useCallback(code => setExpanded(code), [])
    return (
        <Fragment>
            <ButtonTabs handleChange={handleChange} active={expanded}
                        titles={titles}/>
            {
                expanded === 'local'
                    ? <LocalBanksTable rows={localBanks}
                                       nationalBank={nationalBank}/>
                    : <ForeignBankTable rows={foreignBanks}/>
            }
        </Fragment>
    )
}

export default BankLimits