import React, { Fragment } from 'react'
import { Table, TableBody, TableContainer } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import TableRow from '@mui/material/TableRow'
import { v4 as uuid } from 'uuid'
import TableCell from '@mui/material/TableCell'
import {
  GapTableHead,
  TotalOrBoldRow,
  VerticalColumn
} from '../../../UI/Layout/GapHelpers'
import { formatNumber } from '../../../../utils'

const colNames = [
  { propName: 'TOTAL', eqv: 'Итого(UZS екв.)' },
  { propName: 'NATIONAL_CURRENCY', eqv: 'Нац.вал.(UZS)', canEdit: true },
  { propName: 'FOREIGN_CURRENCY', eqv: 'Ин.вал.(USD екв.)' },
  { propName: 'USD', eqv: 'USD', canEdit: true },
  { propName: 'EUR', eqv: 'EUR', canEdit: true }
]

const useStyles = makeStyles(theme => ({
  tableContainer: {
    maxHeight: '80vh'
  },
  bordered: theme.mixins.dottedBorder,
  noWrap: theme.mixins.noWrap
}))

interface EditableCellProps {
    canEdit: boolean | undefined
    row: any
    propName: string
    handleEditClick: (event: React.MouseEvent<HTMLTableHeaderCellElement> | React.MouseEvent<HTMLTableDataCellElement>) => void
    monthIndex: number
    month: string
    eqv: string
    type: string
}

const EditableCell: React.FC<EditableCellProps> = function({
  canEdit = false, row = {}, propName = 'PROP',
  handleEditClick = () => {}, monthIndex = 0, month = 'MONTH',
  eqv = 'EQV', type = 'приток'
}) {
  const classes = useStyles()
  const cellData = formatNumber((row[monthIndex] || {})[propName], true)
  const dataCellInfo = JSON.stringify({
    source: (row[0] || {})['SOURCE'],
    type,
    month: month,
    monthIndex: monthIndex + 1,
    role: (row[0] || {})['ROLE'],
    name: (row[0] || {})['INDICATOR_NAME'],
    cellName: eqv,
    colName: propName,
    numValue: (row[monthIndex] || {})[propName],
    current: formatNumber((row[monthIndex] || {})[propName])
  })
  if (!canEdit) {
    return <TableCell align='center'
      className={classes.noWrap}>{cellData}</TableCell>
  }
  return (<TableCell
    style={{
      borderRight: propName === 'EUR' ? '3px solid #7794aa' : 'default'
    }}
    className={`${classes.noWrap} ${classes.bordered}`}
    data-cellinfo={dataCellInfo}
    onClick={handleEditClick}
    title={'Нажмите, чтобы изменить'}
    align="center">{cellData}</TableCell>
  )
}

interface SimulationTableRowProps {
    months: string[]
    row: any
    handleEditClick: (event: React.MouseEvent<HTMLTableHeaderCellElement> | React.MouseEvent<HTMLTableDataCellElement>) => void
    type?: string
}

const SimulationTableOneRow: React.FC<SimulationTableRowProps> = function({
  months = [], row = {},
  handleEditClick = () => {},
  type = 'приток'
}) {
  const classes = useStyles()
  return (
    <TableRow hover key={uuid()}>
      <TableCell align="left" className={`${classes.noWrap}`}
        style={{ borderRight: '3px solid #7794aa' }}>{
          (row[0] || {})['INDICATOR_NAME']}</TableCell>
      {months.map((month, monthIndex) => <Fragment key={uuid()}>
        {colNames.map(({ propName, eqv, canEdit }) =>
          <EditableCell key={uuid()} row={row} propName={propName}
            type={type}
            monthIndex={monthIndex} month={month}
            handleEditClick={handleEditClick} eqv={eqv}
            canEdit={canEdit}/>)}
      </Fragment>)}
    </TableRow>
  )
}

interface GapSimulationTableProps {
    months: string[]
    sourceOfLiquidity: any
    sourceOfLiquidityTotal: any
    needsOfLiquidity: any
    needsOfLiquidityTotal: any
    vlaLcrData: any
    handleEditClick: (event: React.MouseEvent<HTMLTableHeaderCellElement> | React.MouseEvent<HTMLTableDataCellElement>) => void
}

const GapSimulationTable: React.FC<GapSimulationTableProps> = ({
  months = [], sourceOfLiquidity = [], sourceOfLiquidityTotal = [],
  needsOfLiquidity = [], needsOfLiquidityTotal = [],
  vlaLcrData = [], handleEditClick = () => {}
}) => {
  const classes = useStyles()
  return (
    <Fragment>
      <TableContainer classes={{ root: classes.tableContainer }}>
        <Table size="small" aria-label="a dense table">
          <GapTableHead months={months}/>
          <TableBody>
            <VerticalColumn data={sourceOfLiquidity}
              text='приток'/>
            {sourceOfLiquidity.map((row: any) => (
              <SimulationTableOneRow
                handleEditClick={handleEditClick}
                row={row} months={months}
                key={uuid()}/>))}
            <TotalOrBoldRow months={months} blueBackground
              total={sourceOfLiquidityTotal}/>
            <VerticalColumn data={needsOfLiquidity}
              text='отток'/>
            {needsOfLiquidity.map((row: any) => (
              <SimulationTableOneRow key={uuid()}
                type='отток'
                months={months} row={row}
                handleEditClick={handleEditClick}/>
            ))}
            <TotalOrBoldRow months={months} blueBackground
              total={needsOfLiquidityTotal}/>
            {vlaLcrData.map(
                (row: any, index: number) => <TotalOrBoldRow
                  withPercent={index === 3}
                  blueBackground={index === 3}
                  key={uuid()} align='left'
                  months={months}
                  total={row}/>)}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  )
}

export default GapSimulationTable
