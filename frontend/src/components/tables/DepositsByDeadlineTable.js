import React, {memo} from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import {formatNumber, formatOneDate} from '../../utils'
import ExportButton from '../UI/Layout/ExportButton'
import {useSelector} from 'react-redux'
import {makeStyles} from '@material-ui/core'
import BoldWithColor from '../UI/helpers/BoldWithColor'

const useStyles = makeStyles(theme => ({
    noWrap: theme.mixins.noWrap,
    stickyTableHead: theme.mixins.stickyTableHead
}))

function DepositsByDeadlineTable({rows = []}) {
    const classes = useStyles()
    const {reportDate} = useSelector(state => state.date)
    return (
        <TableContainer component={Paper}>
                <ExportButton id={`deposits-by-deadline-${formatOneDate(reportDate)}`}/>
                <Table id={`deposits-by-deadline-${formatOneDate(reportDate)}`}
                       size="medium" aria-label="a dense table">
                    <TableHead className={classes.stickyTableHead}>
                        <TableRow>
                            <TableCell rowSpan={2}><BoldWithColor>Срок погашения(в днях)</BoldWithColor></TableCell>
                            <TableCell align="center" colSpan={2}><BoldWithColor>Срочные депозити</BoldWithColor></TableCell>
                            <TableCell align="center" colSpan={2}><BoldWithColor>Депозитные сертификаты</BoldWithColor></TableCell>
                            <TableCell align="center" colSpan={2}><BoldWithColor>Сберегателные депозити</BoldWithColor></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align='center'><BoldWithColor>Сумма</BoldWithColor></TableCell>
                            <TableCell align='center'><BoldWithColor>в том числе в иностранной валюте (в екв. в сумах)</BoldWithColor></TableCell>
                            <TableCell align='center'><BoldWithColor>Сумма</BoldWithColor></TableCell>
                            <TableCell align='center'><BoldWithColor>в том числе в иностранной валюте (в екв. в сумах)</BoldWithColor></TableCell>
                            <TableCell align='center'><BoldWithColor>Сумма</BoldWithColor></TableCell>
                            <TableCell align='center'><BoldWithColor>в том числе в иностранной валюте (в екв. в сумах)</BoldWithColor></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row,index) => (
                            <TableRow key={index}>
                                <TableCell>{<b>{row['STATE']}</b>}</TableCell>
                                <TableCell className={classes.noWrap} align='center'>{formatNumber(row['TD_NAT'], 'e')}</TableCell>
                                <TableCell className={classes.noWrap} align='center'>{formatNumber(row['TD_FOR'], 'e')}</TableCell>
                                <TableCell className={classes.noWrap} align='center'>{formatNumber(row['DC_NAT'], 'e')}</TableCell>
                                <TableCell className={classes.noWrap} align='center'>{formatNumber(row['DC_FOR'], 'e')}</TableCell>
                                <TableCell className={classes.noWrap} align='center'>{formatNumber(row['SD_NAT'], 'e')}</TableCell>
                                <TableCell className={classes.noWrap} align='center'>{formatNumber(row['SD_FOR'], 'e')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
    )
}

export default memo(DepositsByDeadlineTable)
