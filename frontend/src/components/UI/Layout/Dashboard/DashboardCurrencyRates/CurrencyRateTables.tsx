import React from 'react'
import {makeStyles, Table, TableBody, TableHead, TableRow} from '@material-ui/core'
import TableCell from '@material-ui/core/TableCell'
import FormattedCell from '../../../helpers/FormattedCell/FormattedCell'
import {v4 as uuid} from 'uuid'
import {formatNumber} from '../../../../../utils'

const useStyles = makeStyles(theme => ({
    noWrap: theme.mixins.noWrap
}))

const currencyOrder = ['USD', 'EUR', 'RUB', 'GBP', 'CHF', 'JPY', 'KZT', 'CNY']

interface DashboardCurrencyRatesProps {
    cbRate: any
}

export const DashboardCurrencyRates: React.FC<DashboardCurrencyRatesProps> = ({cbRate = []}) => {
    return (
        <Table size='small'>
            <TableHead>
                <TableRow>
                    <TableCell align='center'><b>Валюта</b></TableCell>
                    <TableCell align='center'><b>Курс</b></TableCell>
                    <TableCell align='center'><b>Изм.</b></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {currencyOrder.map(currName => {
                    const row = cbRate.find((curr: any) => curr['nominal'] === `1 ${currName}`)
                    return <TableRow key={uuid()}>
                        <TableCell align='center'>{(row || {})['nominal']}</TableCell>
                        <TableCell align='center'>{formatNumber((row || {})['equival'])}</TableCell>
                        <TableCell align='center'><FormattedCell number={(row || {})['differ']}/></TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
    )
}

export const ExternalCurrencyRates = ({rates = []}) => {
    const classes = useStyles()
    return (
        <Table size='small' style={{height: '100%'}}>
            <TableHead>
                <TableRow>
                    <TableCell align='center'><b>Валюта</b></TableCell>
                    <TableCell align='center'><b>Покупка</b></TableCell>
                    <TableCell align='center'><b>Пок. изм.</b></TableCell>
                    <TableCell align='center'><b>Продажа</b></TableCell>
                    <TableCell align='center'><b>Про. изм.</b></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {currencyOrder.map(currName => {
                    const row: any = rates.find(curr => curr['nominal'] === `1 ${currName}`) || {}
                    return <TableRow key={uuid()}>
                        <TableCell align='center'>{(row || {})['nominal']}</TableCell>
                        <TableCell className={classes.noWrap}
                                   align='center'>{formatNumber(+(row || {})['rateParch'] || 0, true)}</TableCell>
                        <TableCell align='center'><FormattedCell dashForZero
                                                                 number={(row || {})['rateParchDiffer']}/></TableCell>
                        <TableCell className={classes.noWrap}
                                   align='center'>{formatNumber(+(row || {})['rateSal'] || 0, true)}</TableCell>
                        <TableCell align='center'><FormattedCell dashForZero number={(row || {})['rateSalDiffer']}/></TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
    )
}