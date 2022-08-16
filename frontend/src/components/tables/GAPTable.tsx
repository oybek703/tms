import React, { Fragment, memo } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableContainer from '@material-ui/core/TableContainer'
import Paper from '@material-ui/core/Paper'
import { formatNumber, formatOneDate } from '../../utils'
import ExportButton from '../UI/Layout/ExportButton'
import { v4 as uuid } from 'uuid'
import { GapTableHead, InnerDataRows, LcrAndNsfrTable, TotalOrBoldRow, VerticalColumn } from '../UI/Layout/GapHelpers'
import { makeStyles } from '@material-ui/core'
import DeficitChart from '../charts/GAP/DeficitChart'

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    maxHeight: '90vh'
  },
  chartContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '218px'
  }
}))

const GAPTable: React.FC<{rows: any}> = function({ rows = {} }) {
  const {
    months = [],
    sourceOfLiquidity = [],
    sourceOfLiquidityTotal = [],
    needsOfLiquidity = [],
    needsOfLiquidityTotal = [],
    vlaLcrData = [],
    lcrData = [],
    nsfrData = []
  } = rows
  const classes = useStyles()
  const chartSeries = vlaLcrData.length > 0 ? vlaLcrData[2].slice(0, 6).map((e: any) => Number(formatNumber(e['FOREIGN_CURRENCY'], false))) : []
  console.log(chartSeries)
  return (
    <Fragment>
      <TableContainer classes={{ root: classes.tableContainer }} component={Paper}>
        <ExportButton id={`gap-${formatOneDate(new Date().toString())}`}/>
        <Table id={`gap-${formatOneDate(new Date().toString())}`} size="small"
          aria-label="a dense table">
          <GapTableHead months={months}/>
          <TableBody>
            <VerticalColumn data={sourceOfLiquidity} text='приток'/>
            <InnerDataRows data={sourceOfLiquidity} months={months}/>
            <TotalOrBoldRow blueBackground months={months}
              total={sourceOfLiquidityTotal}/>
            <VerticalColumn data={needsOfLiquidity} text='отток'/>
            <InnerDataRows data={needsOfLiquidity} months={months}/>
            <TotalOrBoldRow blueBackground months={months}
              total={needsOfLiquidityTotal}/>
            {vlaLcrData.map(
                (row: any, index: number) => <TotalOrBoldRow withPercent={index === 3}
                  blueBackground={index === 3}
                  key={uuid()} align='left'
                  months={months}
                  total={row}/>)}
          </TableBody>
        </Table>
      </TableContainer>
      <br/>
      <div className={classes.chartContainer}>
        <LcrAndNsfrTable halfWidth month={months[1]} data={lcrData}/>
        <DeficitChart series={chartSeries} categories={months.slice(0, 6)}/>
      </div>
      <br/>
      <LcrAndNsfrTable halfWidth data={nsfrData} month={months[1]}/>
    </Fragment>
  )
}

export default memo(GAPTable)
