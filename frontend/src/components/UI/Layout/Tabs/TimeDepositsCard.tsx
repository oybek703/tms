import React from 'react'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import Paper from '@material-ui/core/Paper'
import TableBody from '@material-ui/core/TableBody'
import {makeStyles} from '@material-ui/core'
import {v4 as uuid} from 'uuid'
import {formatNumber} from '../../../../utils'
import BoldWithColor from '../../helpers/BoldWithColor'

const useStyles = makeStyles(theme => ({
    paddingBottom0: theme.mixins.paddingBottom0,
    stickyTableHead: theme.mixins.stickyTableHead,
    sumRow: theme.mixins.blueBackground
}))

interface TimeDepositsCardProps {
    title: string
    data: any
}

const TimeDepositsCard: React.FC<TimeDepositsCardProps> = ({title = 'THERE MUST BE TITLE', data = []}) => {
    const classes = useStyles()
    return (
        <>
            <Table size ='small'>
                <TableHead className={classes.stickyTableHead}>
                    <TableRow>
                        <TableCell align='center'>
                            <BoldWithColor>{title}</BoldWithColor>
                        </TableCell>
                    </TableRow>
                </TableHead>
            </Table>
            <TableContainer className={classes.paddingBottom0} component={Paper}>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell/>
                            <TableCell align='center'>
                                <b>Суммовой эквивалент</b>
                            </TableCell>
                            <TableCell align='center'>
                                <b>Суммовой эквивалент в млн. сум</b>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {['UZS', 'USD', 'EUR'].map((c, i) => <TableRow key={uuid()}>
                            <TableCell align='center'>{c}</TableCell>
                            <TableCell align='center'>{formatNumber(data[i])}</TableCell>
                            <TableCell align='center'>{formatNumber(data[i]/Math.pow(10, 6))}</TableCell>
                        </TableRow>)}
                        <TableRow>
                            <TableCell colSpan={2}/>
                            <TableCell className={classes.sumRow} align='center'>
                                <b>{formatNumber(data.reduce((acc: any, val: any) => acc+=val, 0)/Math.pow(10, 6))}</b>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <br/>
        </>
    )
}

export default TimeDepositsCard