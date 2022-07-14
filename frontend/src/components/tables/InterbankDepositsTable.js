import React, {Fragment, memo, useCallback, useState} from 'react'
import TableContainer from '@material-ui/core/TableContainer'
import Paper from '@material-ui/core/Paper'
import Table from "@material-ui/core/Table"
import InterbankDepositsHead from "../UI/helpers/InterbankDeposits/InterbankDepositsHead"
import InterbankDepositsBody from "../UI/helpers/InterbankDeposits/InterbankDepositsBody"
import TableCap from "../UI/helpers/TableCap"
import InterbankDepositsTab from '../UI/Layout/Tabs/InterbankDepositsTab'
import ExportButton from "../UI/Layout/ExportButton"
import {useSelector} from "react-redux"
import {formatOneDate} from "../../utils"
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    tableContainer: {
        maxHeight: '70vh'
    }
}))

function InterbankDepositsTable({rows = []}) {
    const classes = useStyles()
    const {land, borrow, fullBorrowData, fullLandData} = rows
    const {reportDate} = useSelector(state => state.date)
    const [expanded, setExpanded] = useState('all')
    const handleChange = useCallback(code => setExpanded(code), [])
    return (
        <Fragment>
            <InterbankDepositsTab handleChange={handleChange} active={expanded}/>
            {<TableContainer classes={{root: classes.tableContainer}} component={Paper}>
                <ExportButton id={`${expanded === 'all' ? 'interbank-deposits' : expanded}-${formatOneDate(reportDate)}`}/>
                <Table size='small'
                       tableexport-key={`${expanded === 'all' ? 'interbank-deposits' : expanded}-${formatOneDate(reportDate)}`}
                       id={`${expanded === 'all' ? 'interbank-deposits' : expanded}-${formatOneDate(reportDate)}`}>
                    <InterbankDepositsHead/>
                    {expanded === 'all' &&
                    <Fragment>
                        <InterbankDepositsBody rows={land} isInterbank cap={
                            <TableCap textAlign='center' text='Размещенные межбанковские депозиты' rows={2} isGrey isHead={false}/>
                        }/>
                        <InterbankDepositsBody rows={borrow} isInterbank cap={
                            <TableCap textAlign='center' text='Привлеченные межбанковские депозиты' rows={2} isGrey isHead={false}/>
                        }/>
                    </Fragment>}
                    {expanded === 'borrow' && <InterbankDepositsBody rows={fullBorrowData}/>}
                    {expanded === 'land' && <InterbankDepositsBody rows={fullLandData} extraCurrency='рубль'/>}
                </Table>
            </TableContainer>}
        </Fragment>
    )
}

export default memo(InterbankDepositsTable)
