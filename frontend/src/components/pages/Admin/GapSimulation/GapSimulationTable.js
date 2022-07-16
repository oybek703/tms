import React, {Fragment} from 'react'
import {makeStyles, Table, TableBody, TableContainer} from '@material-ui/core'
import TableRow from '@material-ui/core/TableRow'
import {v4 as uuid} from 'uuid'
import TableCell from '@material-ui/core/TableCell'
import {
  GapTableHead,
  TotalOrBoldRow,
  VerticalColumn
} from '../../../UI/Layout/GapHelpers'
import {formatNumber} from '../../../../utils'

const colNames = [
  {propName: 'TOTAL', eqv: 'Итого(UZS екв.)'},
  {propName: 'NATIONAL_CURRENCY', eqv: 'Нац.вал.(UZS)', canEdit: true},
  {propName: 'FOREIGN_CURRENCY', eqv: 'Ин.вал.(USD екв.)'},
  {propName: 'USD', eqv: 'USD', canEdit: true},
  {propName: 'EUR', eqv: 'EUR', canEdit: true}
]

const useStyles = makeStyles(theme => ({
  tableContainer: {
    maxHeight: '80vh'
  },
  bordered: theme.mixins.dottedBorder,
  noWrap: theme.mixins.noWrap
}))

function EditableCell({
  canEdit = false, row = {}, propName = 'PROP',
  handleEditClick = () => {}, monthIndex = 0, month = 'MONTH',
  eqv = 'EQV', type = 'приток'
}) {
  const classes = useStyles()
  const cellData = formatNumber((row[monthIndex] || {})[[propName]], true)
  const dataCellInfo = JSON.stringify({
    source: (row[0] || {})['SOURCE'],
    type,
    month: month,
    monthIndex: monthIndex + 1,
    role: (row[0] || {})['ROLE'],
    name: (row[0] || {})['INDICATOR_NAME'],
    cellName: eqv,
    colName: propName,
    numValue: (row[monthIndex] || {})[[propName]],
    current: formatNumber((row[monthIndex] || {})[[propName]])
  })
  if (!canEdit) return <TableCell align='center'
      className={classes.noWrap}>{cellData}</TableCell>
  return (<TableCell
          className={`${classes.noWrap} ${classes.bordered}`}
          data-cellinfo={dataCellInfo}
          onClick={handleEditClick}
          title={'Нажмите, чтобы изменить'}
          align="center">{cellData}</TableCell>
  )
}

function SimulationTableOneRow({
  months = [], row = {},
  handleEditClick = () => {},
  type = 'приток'
}) {
  const classes = useStyles()
  return (
      <TableRow key={uuid()}>
        <TableCell align="left" className={`${classes.noWrap}`}>{(row[0] ||
            {})['INDICATOR_NAME']}</TableCell>
        {months.map((month, monthIndex) => <Fragment key={uuid()}>
          {colNames.map(({propName, eqv, canEdit}) =>
              <EditableCell key={uuid()} row={row} propName={propName}
                            type={type}
                            monthIndex={monthIndex} month={month}
                            handleEditClick={handleEditClick} eqv={eqv}
                            canEdit={canEdit}/>)}
        </Fragment>)}
      </TableRow>
  )
}

const GapSimulationTable = ({
  months = [], sourceOfLiquidity = [], sourceOfLiquidityTotal = [],
  needsOfLiquidity = [], needsOfLiquidityTotal = [],
  vlaLcrData = [], handleEditClick = () => {}
}) => {
  const classes = useStyles()
  return (
      <Fragment>
        <TableContainer classes={{root: classes.tableContainer}}>
          <Table size="small" aria-label="a dense table">
            <GapTableHead months={months}/>
            <TableBody>
              <VerticalColumn data={sourceOfLiquidity}
                              text='приток'/>
              {sourceOfLiquidity.map(row => (
                  <SimulationTableOneRow handleEditClick={handleEditClick}
                                         row={row} months={months}
                                         key={uuid()}/>))}
              <TotalOrBoldRow months={months} blueBackground
                              total={sourceOfLiquidityTotal}/>
              <VerticalColumn data={needsOfLiquidity}
                              text='отток'/>
              {needsOfLiquidity.map(row => (
                  <SimulationTableOneRow key={uuid()}
                                         type='отток'
                                         months={months} row={row}
                                         handleEditClick={handleEditClick}/>
              ))}
              <TotalOrBoldRow months={months} blueBackground
                              total={needsOfLiquidityTotal}/>
              {vlaLcrData.map(
                  (row, index) => <TotalOrBoldRow withPercent={index === 3}
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