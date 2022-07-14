import React from 'react'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import {makeStyles, TableBody, TableContainer, TableRow} from '@material-ui/core'
import TableCell from '@material-ui/core/TableCell'
import {v4 as uuid} from 'uuid'
import {covenantData} from '../../../../tempData'


const useStyles = makeStyles(theme => ({
    noWrap: theme.mixins.noWrap,
    blueBackground: theme.mixins.blueBackground,
    stickyTableHead: theme.mixins.stickyTableHead,
    tableContainer: {
        maxHeight: '77vh'
    }
}))



const Covenants = () => {
    const classes = useStyles()
    return (
        <TableContainer className={classes.tableContainer} component={Paper}>
            <Table size='small'>
                <TableHead className={classes.stickyTableHead}>
                    <TableRow>
                        <TableCell className={classes.blueBackground} align='center' rowSpan={2}><b>№</b></TableCell>
                        <TableCell className={classes.blueBackground} align='center' rowSpan={2}><b>Наименование
                            ковенанти</b></TableCell>
                        <TableCell className={classes.blueBackground} align='center' rowSpan={2}><b>AO
                            Асакабанк</b></TableCell>
                        <TableCell className={classes.blueBackground} align='center'
                                   colSpan={9}><b>Контрагент</b></TableCell>
                    </TableRow>
                    <TableRow>
                        {[
                            'China Development Bank',
                            'Landesbank Baden-Wuerttemberg',
                            'VTB BANK (EUROPE)',
                            'АБР',
                            'JPMorgan Chase Bank',
                            'Turkiye Ihracat Kredi Bankasi A.S.',
                            'Europe Asia Investment Finance B.V.',
                            'Европейский Банк Реконструкции и Развития',
                            'Deutsche Bank AG',
                        ].map(bank => <TableCell className={classes.blueBackground} key={uuid()} align='center'>
                            <b>{bank}</b>
                        </TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {covenantData.map((b, index) => (
                        <TableRow key={uuid()}>
                            <TableCell align='center'><b>{index + 1}</b></TableCell>
                            <TableCell><b>{b.title}</b></TableCell>
                            <TableCell align='center'
                                       className={classes.noWrap}>{b.bank_asaka}</TableCell>
                            <TableCell align='center' style={{
                                background: b.bank_1 ? '#56b780' : '',
                                color: 'white'
                            }}
                                       className={classes.noWrap}><b><i>{b.bank_1}</i></b></TableCell>
                            <TableCell align='center' style={{
                                background: b.bank_2 ? '#56b780' : '',
                                color: 'white'
                            }}
                                       className={classes.noWrap}><b><i>{b.bank_2}</i></b></TableCell>
                            <TableCell align='center' style={{
                                background: b.bank_3 ? '#56b780' : '',
                                color: 'white'
                            }}
                                       className={classes.noWrap}><b><i>{b.bank_3}</i></b></TableCell>
                            <TableCell align='center' style={{
                                background: b.bank_4 ? '#56b780' : '',
                                color: 'white'
                            }}
                                       className={classes.noWrap}><b><i>{b.bank_4}</i></b></TableCell>
                            <TableCell align='center' style={{
                                background: b.bank_5 ? '#56b780' : '',
                                color: 'white'
                            }}
                                       className={classes.noWrap}><b><i>{b.bank_5}</i></b></TableCell>
                            <TableCell align='center' style={{
                                background: b.bank_6 ? '#56b780' : '',
                                color: 'white'
                            }}
                                       className={classes.noWrap}><b><i>{b.bank_6}</i></b></TableCell>
                            <TableCell align='center' style={{
                                background: b.bank_7 ? '#56b780' : '',
                                color: 'white'
                            }}
                                       className={classes.noWrap}><b><i>{b.bank_7}</i></b></TableCell>
                            <TableCell align='center' style={{
                                background: b.bank_8 ? '#56b780' : '',
                                color: 'white'
                            }}
                                       className={classes.noWrap}><b><i>{b.bank_8}</i></b></TableCell>
                            <TableCell align='center' style={{
                                background: b.bank_9 ? '#56b780' : '',
                                color: 'white'
                            }}
                                       className={classes.noWrap}><b><i>{b.bank_9}</i></b></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default Covenants