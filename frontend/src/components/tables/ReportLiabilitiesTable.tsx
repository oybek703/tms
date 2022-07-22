import React, { Fragment, memo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { formatNumber } from '../../utils'
import { v4 as uuid } from 'uuid'
import PaginatedTable from '../UI/helpers/PaginatedTable'
import BoldWithColor from '../UI/helpers/BoldWithColor'

const useStyles = makeStyles(theme => ({
    noWrap: theme.mixins.noWrap,
    italic: theme.mixins.italic,
    stickyTableHead: theme.mixins.stickyTableHead,
    tableContainer: {
        maxHeight: '70vh',
    },
}))

const columns = [
    'До 7 дней',
    ...new Array(12).fill('').map((v, i) => `${i + 1} месяц`),
    '1-2 года', 'свыше 2 лет',
]

const ReportLiabilitiesTable: React.FC<{rows: any}> = function({ rows = [] }) {
    const classes = useStyles()
    const bodyColumns = Object.keys([...rows].pop() || {})
        .filter((v, i) => v !== 'NAME' && v !== 'CURRENCY')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    return (
        <Fragment>
            <PaginatedTable
                page={page}
                rowsPerPage={rowsPerPage}
                setPage={setPage}
                setRowsPerPage={setRowsPerPage}
                rows={rows}
                TableData={
                    <TableContainer classes={{ root: classes.tableContainer }} component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead className={classes.stickyTableHead}>
                                <TableRow>
                                    <TableCell
                                        rowSpan={2}><BoldWithColor>№</BoldWithColor></TableCell>
                                    <TableCell align='center'
                                               className={classes.noWrap}
                                               rowSpan={2}><BoldWithColor>Наименование
                                        линии</BoldWithColor></TableCell>
                                    <TableCell align='center'
                                               className={classes.noWrap}
                                               rowSpan={2}><BoldWithColor>Валюта</BoldWithColor></TableCell>
                                    <TableCell align='center'
                                               className={classes.noWrap}
                                               rowSpan={2}><BoldWithColor>Остаток на дату(номинал)</BoldWithColor></TableCell>
                                    <TableCell align='center'
                                               className={classes.noWrap}
                                               rowSpan={2}><BoldWithColor>Остаток на дату(тыс. сум)</BoldWithColor></TableCell>
                                    {columns.map(c => <TableCell
                                        className={classes.noWrap} colSpan={2}
                                        align='center'
                                        key={uuid()}><BoldWithColor>{c}</BoldWithColor></TableCell>)}
                                </TableRow>
                                <TableRow>
                                    {columns.map(_ => <Fragment key={uuid()}>
                                        <TableCell className={classes.noWrap}
                                                   align='center'><BoldWithColor>Номинал</BoldWithColor></TableCell>
                                        <TableCell className={classes.noWrap}
                                                   align='center'><BoldWithColor>экв. в нац. вал.</BoldWithColor></TableCell>
                                    </Fragment>)}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage)
                                    .map((row: any, i: number) => (
                                        <TableRow key={uuid()}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell
                                                className={classes.noWrap}>{row['NAME']}</TableCell>
                                            <TableCell align='center'>
                                                {row['CURRENCY'] === '0'
                                                    ? '000'
                                                    : row['CURRENCY']}
                                            </TableCell>
                                            {bodyColumns.map(
                                                col => <TableCell key={uuid()}
                                                                  className={classes.noWrap}
                                                                  align='center'>
                                                    {formatNumber(row[`${col}`],
                                                        true)}
                                                </TableCell>)}
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }/>
        </Fragment>
    )
}

export default memo(ReportLiabilitiesTable)
