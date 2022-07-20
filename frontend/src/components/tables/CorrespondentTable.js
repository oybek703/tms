import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { formatNumber, formatOneDate } from '../../utils'
import TableCap from '../UI/helpers/TableCap'
import FormattedCell from '../UI/helpers/FormattedCell/FormattedCell'
import StyledTableRow from '../UI/helpers/StyledTableRow'
import ExportButton from '../UI/Layout/ExportButton'
import { useSelector } from 'react-redux'
import BoldWithColor from '../UI/helpers/BoldWithColor'

const useStyles = makeStyles(theme => ({
    noWrap: theme.mixins.noWrap,
    stickyTableHead: theme.mixins.stickyTableHead
}))

function RenderedCorrespondentTable ({ currentState = false, currencyRate = [],
    totalCash = [], interbankDeposits = []}) {
    const { reportDate } = useSelector(state => state.date)
    const classes = useStyles()
    return (
        <TableContainer component={Paper}>
            <ExportButton
                id={`correspondent-${currentState ? 'realtime' : formatOneDate(reportDate)}`}/>
            <Table tableexport-key={`correspondent-${currentState
                ? 'realtime'
                : formatOneDate(reportDate)}`}
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
                    {currencyRate.map((row, i) => (
                        <StyledTableRow key={`${row.state}+${i}`}>
                            <TableCell align='center'>{row['isTableHead'] ?
                                <b>{row.count}</b> : row.count}</TableCell>
                            <TableCell align='left'>{row['isTableHead'] ?
                                <b>{row.state}</b> : row.state}</TableCell>
                            <TableCell className={classes.noWrap}
                                       align="center">{row['isTableHead'] ?
                                <b>{formatNumber(row.UZS, 'e')}</b> : formatNumber(
                                    row.UZS, 'e')}</TableCell>
                            {i !== 1
                                ? <>
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
                                </>
                                : <>
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
                        </StyledTableRow>
                    ))}
                    {[totalCash, interbankDeposits].map(arr => arr.map((row, i) => (
                            <StyledTableRow key={`${row.state}+${i}`}>
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
                            </StyledTableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function CorrespondentTable ({ rows, currentState = false }) {
    const { currencyRate = [], totalCash = [], interbankDeposits = [] } = rows
    return (
        <RenderedCorrespondentTable currencyRate={currencyRate} currentState={currentState}
                                    interbankDeposits={interbankDeposits} totalCash={totalCash}/>
    )
}

export default memo(CorrespondentTable)
