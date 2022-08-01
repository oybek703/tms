import React, { Fragment, memo, useCallback, useState } from 'react'
import TableContainer from '@material-ui/core/TableContainer'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import InterbankDepositsHead from '../UI/helpers/InterbankDeposits/InterbankDepositsHead'
import InterbankDepositsBody from '../UI/helpers/InterbankDeposits/InterbankDepositsBody'
import TableCap from '../UI/helpers/TableCap'
import ButtonTabs from '../UI/Layout/Tabs/ButtonsTab'
import ExportButton from '../UI/Layout/ExportButton'
import { formatOneDate } from '../../utils'
import { makeStyles } from '@material-ui/core'
import useTypedSelector from '../../hooks/useTypedSelector'

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    maxHeight: '70vh'
  }
}))

const titles = [
  { title: 'Межбанковские депозиты', code: 'all' },
  { title: 'Привлеченные', code: 'borrow' },
  { title: 'Размещенные', code: 'land' }
]

const InterbankDepositsTable: React.FC<{rows: any}> = function({ rows = [] }) {
  const classes = useStyles()
  const { land, borrow, fullBorrowData, fullLandData } = rows
  const { reportDate } = useTypedSelector((state) => state.date)
  const [expanded, setExpanded] = useState('all')
  const handleChange = useCallback((code) => setExpanded(code), [])
  return (
    <Fragment>
      <ButtonTabs handleChange={handleChange} active={expanded} titles={titles}/>
      {<TableContainer classes={{ root: classes.tableContainer }} component={Paper}>
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
