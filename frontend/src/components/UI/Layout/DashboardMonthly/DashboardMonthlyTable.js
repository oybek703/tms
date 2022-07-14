import React, {Fragment, memo} from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import {formatNumber, formatOneDate} from '../../../../utils'
import TableCap from '../../helpers/TableCap'
import StyledTableRow from '../../helpers/StyledTableRow'
import ExportButton from '../ExportButton'
import MonthlyPicker from './MonthlyPicker'
import {v4 as uuid} from 'uuid'
import {makeStyles} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    pickerCell: {
        minWidth: 140,
        maxWidth: 150
    },
    noWrap: theme.mixins.noWrap,
    centeredTitleRow: {
        ...theme.mixins.blueBackground,
        fontWeight: '700'
    }
}))

function DashboardMonthlyTable({rows = [], firstDate, secondDate, handleDateChange, operDays, operDaysLoading}) {
    const classes = useStyles()
    const {capital = [], liquidity = [], riskPart = []} = rows
    const colCount = (([...riskPart].pop() || {})['data'] || []).length
    const colsHead = (([...riskPart].pop() || {})['data'] || []).map((c, i) => {
        if(i !== 0 && i !== colCount-1) {
            return c['MONTH_BEGIN'] || c['DATE_VALUE']
        }
        return undefined
    }).filter(Boolean)
    if(!(firstDate || secondDate || capital.length || liquidity.length || riskPart.length)) {
        return <Fragment/>
    }
    return (
        <TableContainer component={Paper}>
            <ExportButton id='dashboard-monthly'/>
            <Table id='dashboard-monthly' size="small" aria-label="a dense table">
                    <TableCap rows={colCount+4} text={'млн. сум'}/>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center' rowSpan={2}><b>№</b></TableCell>
                            <TableCell rowSpan={2} align='center'><b>Показатели</b></TableCell>
                            <TableCell className={classes.pickerCell} align="center" rowSpan={2}>
                                <span hidden>{firstDate}</span>
                                <MonthlyPicker
                                    disabled={operDaysLoading}
                                    reportDate={firstDate}
                                    operDays={operDays}
                                    handleDateChange={handleDateChange('first_date')}
                                    />
                            </TableCell>
                            {colsHead.map(h => <TableCell align='center'
                                className={classes.noWrap} key={uuid()} rowSpan={2}>{h}</TableCell>)}
                            <TableCell className={classes.pickerCell} align="center" rowSpan={2}>
                                <span hidden>{secondDate}</span>
                                <MonthlyPicker
                                    disabled={operDaysLoading}
                                    reportDate={secondDate}
                                    operDays={operDays}
                                    handleDateChange={handleDateChange('second_date')}
                                />
                            </TableCell>
                            <TableCell align="center" colSpan={2}><b>Разница</b></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center"><b>(+;-)</b></TableCell>
                            <TableCell align="center"><b>%</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            [
                                {rows: capital, title: 'КАПИТАЛ'},
                                {rows: liquidity, title: 'ЛИКВИДНОСТЬ'},
                                {rows: riskPart, title: 'КАЧЕСТВО АКТИВОВ'},
                            ].map(({rows, title}) => <Fragment key={uuid()}>
                                <TableRow>
                                    <TableCell className={classes.centeredTitleRow}
                                               align='center' colSpan={colCount+4}>
                                        <b>{title}</b>
                                    </TableCell>
                                </TableRow>
                                {rows.map((row,index) => (
                                    <StyledTableRow key={index}>
                                        <TableCell align="center"><b>{row['count']}</b></TableCell>
                                        <TableCell>{row['isTableHead'] ? <b>{row['state']}</b> : row['state']}</TableCell>
                                        {row['data'].map((d, j) => <TableCell className={classes.noWrap}
                                                                              align='center' key={uuid()}
                                                                              title={`${row['state']} - ${j === 0
                                                                                  ? formatOneDate(firstDate)
                                                                                  : j === colCount-1
                                                                                      ? formatOneDate(secondDate)
                                                                                      : colsHead[j-1]}`}>
                                            {formatNumber(d['SUM'])} {row['withPercent'] ? '%' : ''}
                                        </TableCell>)}
                                        <TableCell className={classes.noWrap} align="center">
                                            {formatNumber(row['differ'])} {row['withPercent'] ? '%' : ''}
                                        </TableCell>
                                        <TableCell className={classes.noWrap} align="center">
                                            {row['differ_percent']} {row['withPercent'] ? '%' : ''}
                                        </TableCell>
                                    </StyledTableRow>
                                ))}
                            </Fragment>)
                        }
                    </TableBody>
                </Table>
        </TableContainer>
    )
}

export default memo(DashboardMonthlyTable)
