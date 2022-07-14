import React, {memo} from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import {formatDate, formatNumber} from "../../utils"
import TableCap from "../UI/helpers/TableCap"
import StyledTableRow from "../UI/helpers/StyledTableRow"
import ExportButton from "../UI/Layout/ExportButton"
import { makeStyles } from '@material-ui/core'
import BoldWithColor from '../UI/helpers/BoldWithColor'

const useStyles = makeStyles(theme => ({
    stickyHead: theme.mixins.stickyTableHead,
    blueBackground: theme.mixins.blueBackground
}))

function ProfitAndLostTable({pickedDate, rows}) {
    const {yearFirstDate, monthFirstDate, selectedDate} = formatDate(pickedDate)
    const classes = useStyles()
    return (
        <TableContainer component={Paper}>
                <ExportButton id={`profit-and-lost-${selectedDate}`}/>
                <Table id={`profit-and-lost-${selectedDate}`} size="small" aria-label="a dense table">
                    <TableCap rows={7} text={'млрд. сум'}/>
                    <TableHead className={classes.stickyHead}>
                        <TableRow>
                            <TableCell align='center'><BoldWithColor>№</BoldWithColor></TableCell>
                            <TableCell><BoldWithColor>Наименование показателей</BoldWithColor></TableCell>
                            <TableCell align="center"><BoldWithColor>{yearFirstDate}</BoldWithColor></TableCell>
                            <TableCell align="center"><BoldWithColor>{monthFirstDate}</BoldWithColor></TableCell>
                            <TableCell align="center"><BoldWithColor>{selectedDate}</BoldWithColor></TableCell>
                            <TableCell align="center"><BoldWithColor>Ежемесячная разница</BoldWithColor></TableCell>
                            <TableCell align="center"><BoldWithColor>Ежемесячная разница (%)</BoldWithColor></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row,index) => (
                            <StyledTableRow key={index}>
                                <TableCell align="center"><b>{row['count']}</b></TableCell>
                                <TableCell>{row['isTableHead'] ? <b>{row['indicator_name']}</b> : row['indicator_name']}</TableCell>
                                <TableCell align="center">{row['isTableHead'] ? <b>{formatNumber(row['yearBegin'])}</b> : formatNumber(row['yearBegin'])}</TableCell>
                                <TableCell align="center">{row['isTableHead'] ? <b>{formatNumber(row['monthBegin'])}</b> : formatNumber(row['monthBegin'])}</TableCell>
                                <TableCell align="center">{row['isTableHead'] ? <b>{formatNumber(row['selectedDate'])}</b> : formatNumber(row['selectedDate'])}</TableCell>
                                <TableCell align="center">{row['isTableHead'] ? <b>{formatNumber(row['differ'], true)}</b> : formatNumber(row['differ'], true)}</TableCell>
                                <TableCell align="center">{row['differ_percent']}</TableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
    )
}

export default memo(ProfitAndLostTable)
