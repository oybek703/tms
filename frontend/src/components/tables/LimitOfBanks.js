import React, {Fragment, memo} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import {formatNumber} from '../../utils'
import TableCap from '../UI/helpers/TableCap'
import ExportButton from '../UI/Layout/ExportButton'
import {v4 as uuid} from 'uuid'
import BoldWithColor from '../UI/helpers/BoldWithColor'

const useStyles = makeStyles(theme => ({
    noWrap: theme.mixins.noWrap,
    stickyCol: theme.mixins.stickyCol,
    stickyTableHead: theme.mixins.stickyTableHead,
    blueBackground: theme.mixins.blueBackground
}))

function LimitOfBanks({rows = {}}) {
    const {data = [], period = {}} = rows
    const classes = useStyles()
    const currencies = ['UZS', 'CNY', 'JPY', 'KZT', 'RUB', 'CHF', 'GBP', 'USD', 'EUR']
    return (
        <TableContainer component={Paper}>
            <ExportButton id='limit-of-banks'/>
            <Table
                   tableexport-key='limit-of-banks'
                   id='limit-of-banks'
                   size="small" aria-label="a dense table">
                   <TableCap rows={2} text={`от ${period['DATE_BEGIN']} до ${period['DATE_END']} (в ном.)`}/>
                <TableHead className={classes.stickyTableHead}>
                        <TableRow>
                            <TableCell align='center' className={`${classes.stickyCol} ${classes.blueBackground}`} rowSpan={2}><BoldWithColor>№</BoldWithColor></TableCell>
                            <TableCell align='center' className={`${classes.stickyCol} ${classes.blueBackground}`} rowSpan={2}>
                                <BoldWithColor>Наименование</BoldWithColor>
                            </TableCell>
                            {currencies.map(c => <TableCell key={uuid()} align="center" colSpan={3}><BoldWithColor>{c}</BoldWithColor></TableCell>)}
                        </TableRow>
                        <TableRow>
                            {currencies.map(_ => <Fragment key={uuid()}>
                              <TableCell align='center'><BoldWithColor>Сальдо</BoldWithColor></TableCell>
                                <TableCell align='center'><BoldWithColor>Лимит</BoldWithColor></TableCell>
                                <TableCell align='center'><BoldWithColor>Разница</BoldWithColor></TableCell>
                            </Fragment>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((r, i) => (
                            <TableRow key={uuid()}>
                                <TableCell className={classes.stickyCol}><BoldWithColor>{i+1}</BoldWithColor></TableCell>
                                <TableCell className={classes.stickyCol}><BoldWithColor>{r['NAME']}</BoldWithColor></TableCell>
                                {currencies.map(c => <Fragment key={uuid()}>
                                    <TableCell className={classes.noWrap}>{formatNumber(r[`${c}`], true)}</TableCell>
                                    <TableCell className={classes.noWrap}>{formatNumber(r[`LIMIT_${c}`], true)}</TableCell>
                                    <TableCell
                                        style={{
                                            background: `${r[`DIFFER_${c}`] < 0 ? '#ff8a1b' : 
                                                r[`${c}`] !== 0 && r[`LIMIT_${c}`] !== 0 && r[`DIFFER_${c}`] === 0  ? '#ff8a1b' : 'white'}`,
                                            color: `${r[`DIFFER_${c}`] >= 0 ? 'green' : 'white'}`
                                        }}
                                               className={classes.noWrap}>
                                        {formatNumber(r[`DIFFER_${c}`], true)}
                                    </TableCell>
                                </Fragment>)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
        </TableContainer>
    )
}

export default memo(LimitOfBanks)
