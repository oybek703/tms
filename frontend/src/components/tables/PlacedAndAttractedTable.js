import React, { Fragment, memo } from 'react'
import Table from '@material-ui/core/Table'
import TableContainer from '@material-ui/core/TableContainer'
import Paper from '@material-ui/core/Paper'
import TableCap from '../UI/helpers/TableCap'
import {
    Grid,
    makeStyles,
    TableBody,
    TableHead,
    TableRow,
} from '@material-ui/core'
import TableCell from '@material-ui/core/TableCell'
import { formatNumber, formatOneDate } from '../../utils'
import InvolvedFunds from '../charts/Dashboard/PlacedAndAttracted/InvolvedFunds'
import PlacedFunds from '../charts/Dashboard/PlacedAndAttracted/PlacedFunds'
import ExportButton from '../UI/Layout/ExportButton'
import { useSelector } from 'react-redux'
import BoldWithColor from '../UI/helpers/BoldWithColor'

function getFundCategoryAndSeries(fundData = []) {
    let fundChartData = [...fundData].filter(f => f['forChart'])
        .map(f => ({category: f['fund_name'], sum: f['sum']}))
    const involvedChartLeftData = ([...fundData].pop() || {})['sum'] - fundChartData
        .reduce((acc, val) => acc += val['sum'], 0)
    fundChartData = fundChartData.concat({category: 'Прочие', sum: involvedChartLeftData})
        .map(f => ({...f, sum: +(f['sum'] / Math.pow(10, 6)).toFixed(2)}))
    const fundCategories = fundChartData.map(f => f['category'])
    const fundSeries = fundChartData.map(f => f['sum'])
    return [fundCategories, fundSeries]
}

const useStyles = makeStyles(theme => ({
    noWrap: theme.mixins.noWrap,
    stickyTableHead: theme.mixins.stickyTableHead,
    wrappedRow: {
        maxWidth: 200
    }
}))

function PlacedAndAttractedTable({rows = {}, forDashboard = false}) {
    const classes = useStyles()
    const {reportDate} = useSelector(state => state.date)
    const {involvedFunds = [], placedFunds = []} = rows
    const [involvedCategories, involvedSeries] = getFundCategoryAndSeries(involvedFunds)
    const [placedCategories, placedSeries] = getFundCategoryAndSeries(placedFunds)
    if(forDashboard) return (<Fragment>
        <Grid container spacing={2} justify='space-between'>
            <Grid item xs={12} sm={6}>
                <InvolvedFunds series={involvedSeries} categories={involvedCategories}/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <PlacedFunds series={placedSeries} categories={placedCategories}/>
            </Grid>
        </Grid>
    </Fragment>)
    return (
        <Fragment>
            {<TableContainer component={Paper}>
                <ExportButton id={`placed-attracted-${formatOneDate(reportDate)}`}/>
                <Table id={`placed-attracted-${formatOneDate(reportDate)}`} size="small" aria-label="a dense table">
                    <TableCap text='тыс. сум' rows={8}/>
                    <TableHead className={classes.stickyTableHead}>
                        <TableRow>
                            <TableCell align='center' colSpan={4}>
                                <BoldWithColor>ПРИВЛЕЧЕННЫЕ СРЕДСТВА</BoldWithColor>
                            </TableCell>
                            <TableCell align='center' colSpan={4}>
                                <BoldWithColor>РАЗМЕЩЕННЫЕ СРЕДСТВА</BoldWithColor>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><BoldWithColor>Наименование</BoldWithColor></TableCell>
                            <TableCell align='center'><BoldWithColor>Балансовые счета</BoldWithColor></TableCell>
                            <TableCell align='center'><BoldWithColor>Сумма</BoldWithColor></TableCell>
                            <TableCell align='center'><BoldWithColor>в % к итогу</BoldWithColor></TableCell>
                            <TableCell><BoldWithColor>Наименование</BoldWithColor></TableCell>
                            <TableCell align='center'><BoldWithColor>Балансовые счета</BoldWithColor></TableCell>
                            <TableCell align='center'><BoldWithColor>Сумма</BoldWithColor></TableCell>
                            <TableCell align='center'><BoldWithColor>в % к итогу</BoldWithColor></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {involvedFunds.map((f, i) => (
                            <TableRow key={f['fund_name']}>
                                <TableCell className={classes.wrappedRow}>{f['fund_name']}</TableCell>
                                <TableCell align='center'>{f['balance_code']}</TableCell>
                                <TableCell align='center' className={classes.noWrap}>{formatNumber(f['sum'])}</TableCell>
                                <TableCell align='center'>{f['percent']}</TableCell>
                                <TableCell>{placedFunds[i]['fund_name']}</TableCell>
                                <TableCell align='center'
                                           className={classes.noWrap}>{placedFunds[i]['balance_code']}</TableCell>
                                <TableCell align='center'
                                           className={classes.noWrap}>{formatNumber(placedFunds[i]['sum'])}</TableCell>
                                <TableCell align='center'>{placedFunds[i]['percent']}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            }
        </Fragment>
    )
}

export default memo(PlacedAndAttractedTable)
