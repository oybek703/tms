import React, { Fragment } from 'react'
import { v4 as uuid } from 'uuid'
import TableCell from '@material-ui/core/TableCell'
import { formatNumber } from '../../../../utils'
import TableRow from '@material-ui/core/TableRow'
import { makeStyles } from '@material-ui/core/styles'
import TableHead from '@material-ui/core/TableHead'
import WhiteCell from '../../helpers/FormattedCell/WhiteCell'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableContainer from '@material-ui/core/TableContainer'
import BoldWithColor from '../../helpers/BoldWithColor'
import theme from '../../theme'

const useStyles = makeStyles({
  noWrap: theme.mixins.noWrap,
  verticalText: {
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '1.8em'
  },
  darkBackground: {
    backgroundColor: '#eeeeee',
    fontWeight: 'bold'
  },
  stickyCol: theme.mixins.stickyCol,
  blueBackground: theme.mixins.blueBackground,
  stickTableHead: theme.mixins.stickyTableHead,
  redRow: {
    fontWeight: 600,
    color: 'rgb(255, 51, 0)'
  },
  bordered: theme.mixins.dottedBorder
})

interface RenderByMonthProps {
  months: string[]
  row: any
  total?: boolean
  blueBackground?: boolean
  withPercent?: boolean
}

const RenderByMonth: React.FC<RenderByMonthProps> = function({
  months = [], row = {}, total = false,
  blueBackground = false, withPercent = false
}) {
  const classes = useStyles()
  return <Fragment>
    {months.map((_, monthIndex) => <Fragment key={uuid()}>
      {['TOTAL', 'NATIONAL_CURRENCY', 'FOREIGN_CURRENCY', 'USD', 'EUR'].map(
          (propName, index) =>
            <Fragment key={uuid()}>
              <TableCell
                className={`${classes.noWrap} ${total && classes.darkBackground} 
                        ${blueBackground ? classes.blueBackground : ''} 
                        ${(row[monthIndex] || {})['editable'] &&
              classes.bordered}`}
                style={{
                  borderRight: index === 4 ? total ? !blueBackground ? '1px solid #7794aa':
                  '1px solid #eee' :
                  '1px solid #7794aa' : '1px solid #eee',
                  borderLeft: index === 0 ? total ? !blueBackground ? '1px solid #7794aa':
                  '1px solid #eee' :
                  '1px solid #7794aa' : '1px solid #eee'
                }}
                align="center">
                {formatNumber(((row[monthIndex] || {}) || {})[propName],
                    true)}{withPercent && '%'}
              </TableCell>
            </Fragment>)}
    </Fragment>)}
  </Fragment>
}

interface TotalOrBoldRowProps {
  months: string[]
  total: any
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'
  blueBackground: boolean
  withPercent?: boolean
}

const TotalOrBoldRow: React.FC<TotalOrBoldRowProps> = function({ months, total, align = 'center', blueBackground = false, withPercent = false }) {
  const classes = useStyles()
  return <TableRow key={uuid()}>
    <TableCell align={align}
      className={`${classes.noWrap} ${classes.darkBackground} ${blueBackground ?
                 classes.blueBackground :
                 ''}`} colSpan={2}>
      {(total[0] || {})['INDICATOR_NAME']}
    </TableCell>
    <RenderByMonth blueBackground={blueBackground} withPercent={withPercent}
      total months={months} row={total}/>
  </TableRow>
}

const VerticalColumn: React.FC<{ data: [], text: string }> = function({ data = [], text = '????????????' }) {
  const classes = useStyles()
  return <TableRow>
    <TableCell align='center' style={{ borderRight: '2px solid #7794aa' }} rowSpan={data.length + 1}>
      <div className={classes.verticalText}>{text}</div>
    </TableCell>
  </TableRow>
}

const InnerDataRows: React.FC<{ data: any; months: string[] }> = function({ data = [], months }) {
  const classes = useStyles()
  if (data.length === 0) return <tr/>
  return <>
    {data.map((row: any) => (
      <TableRow key={uuid()}>
        <TableCell align='left'
          className={classes.noWrap}>
          {(row[0] || {})['INDICATOR_NAME']}
        </TableCell>
        <RenderByMonth row={row} months={months}/>
      </TableRow>
    ))}
  </>
}

interface GapTableHeadProps {
  months: string[]
}

const GapTableHead: React.FC<GapTableHeadProps> = function({ months = [] }) {
  const classes = useStyles()
  return <TableHead className={classes.stickTableHead}>
    <TableRow>
      <WhiteCell rowSpan={2}/>
      <WhiteCell align='center' rowSpan={2}><b>????????????????????????</b></WhiteCell>
      {months.map((month) => <WhiteCell
        key={uuid()}
        colSpan={5}
        style={{
          borderRight: '1px solid #ddd',
          borderLeft: '1px solid #ddd'
        }}
        align='center'>
        <b>{month}</b>
      </WhiteCell>)}
    </TableRow>
    <TableRow>
      {months.map((_) => <Fragment key={uuid()}>
        {[
          '?????????? (UZS ??????.)',
          '??????.??????. (UZS)',
          '????.??????. (USD ??????.)',
          'USD',
          'EUR'].map((propName, index) => <WhiteCell
          key={uuid()}
          style={{
            borderRight: index === 4 ? '1px solid #ddd' : '1px solid #eee',
            borderLeft: index === 0 ? '1px solid #ddd' : '1px solid #eee'
          }}
          align='center'>
          <b>{propName}</b>
        </WhiteCell>)}
      </Fragment>)}
    </TableRow>
  </TableHead>
}

const RedRow: React.FC<{ row: any }> = function({ row = {} }) {
  const classes = useStyles()
  return <TableRow>
    <TableCell className={classes.redRow}>{row['INDICATOR_NAME']}</TableCell>
    <TableCell align='center'
      className={`${classes.redRow} ${classes.noWrap}`}>{formatNumber(
          row['TOTAL'])}%</TableCell>
    <TableCell align='center'
      className={`${classes.redRow} ${classes.noWrap}`}>{formatNumber(
          row['NATIONAL_CURRENCY'])}%</TableCell>
    <TableCell align='center'
      className={`${classes.redRow} ${classes.noWrap}`}>{formatNumber(
          row['FOREIGN_CURRENCY'])}%</TableCell>
  </TableRow>
}

function LcrAndNsfrTable({ data = [], month = '', halfWidth = false }) {
  const classes = useStyles()
  return <TableContainer component={Paper}
    style={{ maxWidth: halfWidth ? '50%' : '100%' }}>
    <Table size='small'>
      <TableHead className={classes.stickTableHead}>
        <TableRow>
          <TableCell><BoldWithColor>{month}</BoldWithColor></TableCell>
          <TableCell
            align='center'><BoldWithColor>??????????</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>??????.
            ??????.</BoldWithColor></TableCell>
          <TableCell align='center' className={classes.noWrap}><BoldWithColor>????.
            ??????.</BoldWithColor></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) =>
          index === 0 ?
            <RedRow key={uuid()} row={row}/> :
            <TableRow key={uuid()}>
              <TableCell>{row['INDICATOR_NAME']}</TableCell>
              <TableCell align='center'
                className={classes.noWrap}>{formatNumber(
                    row['TOTAL'])}</TableCell>
              <TableCell align='center'
                className={classes.noWrap}>{formatNumber(
                    row['NATIONAL_CURRENCY'])}</TableCell>
              <TableCell align='center'
                className={classes.noWrap}>{formatNumber(
                    row['FOREIGN_CURRENCY'])}</TableCell>
            </TableRow>)}
      </TableBody>
    </Table>
  </TableContainer>
}

export {
  TotalOrBoldRow, VerticalColumn,
  InnerDataRows, RenderByMonth,
  GapTableHead, LcrAndNsfrTable
}
