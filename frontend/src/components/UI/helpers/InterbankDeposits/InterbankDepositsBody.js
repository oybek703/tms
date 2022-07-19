import React, {Fragment} from 'react'
import TableCap from "../TableCap"
import {makeStyles, TableRow} from "@material-ui/core"
import StyledTableRow from "../StyledTableRow"
import TableCell from "@material-ui/core/TableCell"
import {formatNumber, formatOneDate} from "../../../../utils"
import TableBody from "@material-ui/core/TableBody"

const useStyles = makeStyles(theme => ({
    noWrap: theme.mixins.noWrap,
    weighted_percent: {
        background: 'red',
        color: 'white',
        fontWeight: 'bold'
    }
}))

const InterbankDepositsBody = ({rows = [], extraCurrency, isInterbank = false, cap = <></>}) => {
    const classes = useStyles()
    const currencies = ['сум', 'доллар', 'евро']
    if(extraCurrency) currencies.push(extraCurrency)
    return (
        <>
            {currencies.map((t, j) => (
                <Fragment key={j}>
                    <TableBody>
                        {(cap && j === 0) && cap}
                        <TableCap textAlign='center' redBack rows={10} text={`${t}`} isHead={false}/>
                        {((rows[j] || {})['allMappedBanks'] || []).map((b, i) => (
                            <TableRow key={i}>
                                <TableCell>{i+1}</TableCell>
                                <TableCell align='left' title={b['NAME_BANK']}>
                                    {b['NAME_BANK']}
                                </TableCell>
                                <TableCell align='center' className={classes.noWrap}>{formatNumber(b['SALDO_OUT'])}</TableCell>
                                <TableCell align='center'>
                                    {b['BEGIN_DATE'] === "0" || !b['BEGIN_DATE'] ? '' : (isInterbank ? formatOneDate(b['BEGIN_DATE']) : b['BEGIN_DATE'])}
                                </TableCell>
                                <TableCell align='center'>
                                    {b['END_DATE'] === "0" || !b['END_DATE'] ? '' : (isInterbank ? formatOneDate(b['END_DATE']) : b['END_DATE'])}
                                </TableCell>
                                <TableCell align='center'>{formatNumber(b['PERCENT_RATE'])}%</TableCell>
                                <TableCell align='center' className={classes.noWrap}>{formatNumber(b['FOR_DAY'], true)}</TableCell>
                                <TableCell align='center' className={classes.noWrap}>{formatNumber(b['FOR_PERIOD'], true)}</TableCell>
                                <TableCell align='center' className={classes.noWrap}>{formatNumber(b['DAY_COUNT'])}</TableCell>
                                <TableCell align='center'>{b['PERCENT_SHARE']}%</TableCell>
                            </TableRow>
                        ))}
                        <StyledTableRow>
                            <TableCell colSpan={2}><b>{((rows[j] || {}).sumRow || [])[0]}</b></TableCell>
                            <TableCell className={classes.noWrap} align='center'>
                                <b>{formatNumber(((rows[j] || {}).sumRow || [])[1])}</b>
                            </TableCell>
                            <TableCell colSpan={2} className={classes.weighted_percent}>Средневзвешенные % ставка</TableCell>
                            <TableCell className={`${classes.noWrap} ${classes.weighted_percent}`} align='center'><b>{formatNumber(((rows[j] || {}).sumRow || [])[2])}%</b></TableCell>
                            <TableCell className={classes.noWrap} align='center'><b>{formatNumber(((rows[j] || {}).sumRow || [])[3])}</b></TableCell>
                            <TableCell className={classes.noWrap} align='center'>
                                <b>{formatNumber(((rows[j] || {}).sumRow || [])[4])}</b>
                            </TableCell>
                            <TableCell/>
                            <TableCell align='center'><b>{((rows[j] || {}).sumRow || [])[5]}</b></TableCell>
                        </StyledTableRow>
                    </TableBody>
                </Fragment>
            ))}
        </>
    )
}

export default InterbankDepositsBody