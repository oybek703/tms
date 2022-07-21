import React, { Fragment, memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import Paper from '@material-ui/core/Paper'
import TableCap from '../UI/helpers/TableCap'
import StyledTableRow from '../UI/helpers/StyledTableRow'
import { formatNumber, formatOneDate } from '../../utils'
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined'
import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined'
import Typography from '@material-ui/core/Typography'
import ExpenditureDynamics from '../charts/CalcFor/ExpenditureDynamics'
import { TableRow } from '@material-ui/core'
import CorrespondentDynamics from '../charts/Dashboard/ForCharts/CorrespondentDynamic'
import Deviation from '../charts/Dashboard/ForCharts/Deviation'
import Alert from '../UI/Layout/Alert'
import ExportButton from '../UI/Layout/ExportButton'
import BoldWithColor from '../UI/helpers/BoldWithColor'
import { Variant } from '@material-ui/core/styles/createTypography'
import useTypedSelector from '../../hooks/useTypedSelector'

const useStyles = makeStyles(theme => ({
    noWrap: theme.mixins.noWrap,
    italic: theme.mixins.italic,
    cbNorm: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    editIcon: {
        padding: '1px 3px',
        cursor: 'pointer',
        backgroundColor: '#eee',
        color: '#000',
        transform: 'scale(1)',
        '&:hover': {
            backgroundColor: '#000',
            color: 'white',
            transform: 'scale(1.1)',
        }
    },
    grow: theme.mixins.grow,
    paddingBottom0: {
        ...theme.mixins.paddingBottom0,
        ...theme.mixins.marginBottom10
    },
    mainTable: theme.mixins.marginTop10,
    down: theme.mixins.down,
    stickyTableHead: theme.mixins.stickyTableHead,
    formattedCell: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}))

interface FormattedDataProps {
    number: number
    variant?: Variant | 'inherit'
}

const FormattedData: React.FC<FormattedDataProps> = ({ number, variant = 'body2' }) => {
    const classes = useStyles()
    return (
        <span className={classes.formattedCell}>
            {<Typography component='span' variant={variant}
                         className={number < 0 ? classes.down : classes.grow}>
                {formatNumber(number, 'e')}
            </Typography>
            }
            {
                number < 0
                    ? <ArrowDropDownOutlinedIcon color='error'/>
                    : number === 0 ? '' : <ArrowDropUpOutlinedIcon className={classes.grow}/>
            }
        </span>
    )
}

interface CalcForTableProps {
    rows:any
    forDashboard: boolean
}

const CalcForTable: React.FC<CalcForTableProps> = ({rows = [], forDashboard = false}) => {
    const classes = useStyles()
    const {user: {role}} = useTypedSelector(state => state.auth)
    const {reportDate} = useTypedSelector(state => state.date)
    const forValues = rows.filter((r: any) => r['F_O_R'] !== 0)
    const forSum = rows.reduce((acc: any, val: any) => acc += val['F_O_R'], 0) / forValues.length
    const consumptionSum = rows.reduce((acc: any, val: any) => acc += val['AVG_CONSUMPTION'], 0)
    const cbStandards = rows.filter((r: any) => r['CB_STANDARD'] !== 0)
    const cbStandardAverage = cbStandards.reduce((acc: any, val: any) => acc += val['CB_STANDARD'], 0) / cbStandards.length
    const deviationSum = forSum - cbStandardAverage
    const categories = rows.map((r: any) => r['DATE_VALUE'])
    const expenditureSeries = rows.map((r: any) => r['AVG_CONSUMPTION'])
    const correspondentSeries = rows.map((r: any) => r['F_O_R'])
    const deviationSeries = rows.map((r: any) => r['ST_DEVIATION'])
    if(forDashboard) return (<Fragment>
        <CorrespondentDynamics series={correspondentSeries} categories={categories}/>
        <br/>
        <Deviation series={deviationSeries} categories={categories}/>
    </Fragment>)
    return (
        <Fragment>
            {!rows.length && <Alert type='warning' message={`Central Bank Standard is not entered yet. 
                                    ${role === 'admin' ? 'Please, make sure it is    entered.' : 'Report admin user about it.'}`}/>}
            <TableContainer component={Paper} className={classes.paddingBottom0}>
                <Table size='small'>
                    <TableHead className={classes.stickyTableHead}>
                        <TableRow>
                            <TableCell align='center'>
                                <BoldWithColor><h3>Исполнение норматива, в %</h3></BoldWithColor>
                            </TableCell>
                            <TableCell align='center'>
                                <BoldWithColor><h3>Разница (+;-)</h3></BoldWithColor>
                            </TableCell>
                            <TableCell align='center'>
                                <BoldWithColor><h3>Средний расход за превышенную сумму</h3></BoldWithColor>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align='center'>
                                <b><FormattedData number={forSum * 100 / cbStandardAverage} variant='h6'/></b>
                            </TableCell>
                            <TableCell align='left'>
                                <b><FormattedData number={deviationSum} variant='h6'/></b>
                            </TableCell>
                            <TableCell align='left'>
                                <b><FormattedData number={consumptionSum} variant='h6'/></b>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <ExpenditureDynamics categories={categories} series={expenditureSeries}/>
            <TableContainer component={Paper} className={classes.mainTable}>
                <ExportButton id={`calc-for-${formatOneDate(reportDate)}`}/>
                <Table id={`calc-for-${formatOneDate(reportDate)}`} size="small" aria-label="a dense table">
                    <TableCap rows={5} text={'тыс. сум'}/>
                    <TableHead className={classes.stickyTableHead}>
                        <TableRow>
                            <TableCell scope="row" align='center'><BoldWithColor>Дата</BoldWithColor></TableCell>
                            <TableCell scope="row" align='center'><BoldWithColor>Фактический остаток на корсчете</BoldWithColor></TableCell>
                            <TableCell scope="row" align='center'>
                                <BoldWithColor>Норматив ЦБ</BoldWithColor>
                            </TableCell>
                            <TableCell scope="row" align='center'><BoldWithColor>Отклонение от норматива</BoldWithColor></TableCell>
                            <TableCell scope="row" align='center'><BoldWithColor>Средний расход за превышенную сумму</BoldWithColor></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row: any, i: number) => (
                            <StyledTableRow key={i}>
                                <TableCell align='center'>{row.DATE_VALUE}</TableCell>
                                <TableCell align='center'>{formatNumber(row.F_O_R, 'e')}</TableCell>
                                <TableCell align='center'>{formatNumber(row.CB_STANDARD, 'e')}</TableCell>
                                <TableCell align='center'>
                                    <FormattedData number={row.ST_DEVIATION}/>
                                </TableCell>
                                <TableCell align='left'>
                                    <FormattedData number={row.AVG_CONSUMPTION}/>
                                </TableCell>
                            </StyledTableRow>
                        ))}
                        <TableRow>
                            <TableCell scope="row" align='center'><b>ИТОГО</b></TableCell>
                            <TableCell scope="row" align='center'><b>
                                {formatNumber((forSum || 0), 'e')}</b></TableCell>
                            <TableCell scope="row" align='center'>
                                <b>{formatNumber((cbStandardAverage || 0), 'e')}</b>
                            </TableCell>
                            <TableCell align='center'>
                                <FormattedData number={deviationSum}/>
                            </TableCell>
                            <TableCell align='center'>
                                <FormattedData number={consumptionSum}/>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Fragment>
    )
}

export default memo(CalcForTable)
