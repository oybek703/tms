import React, { memo } from 'react'
import makeStyles from '@mui/styles/makeStyles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { formatNumber, formatOneDate } from '../../utils'
import TableCap from '../UI/helpers/TableCap'
import ExportButton from '../UI/Layout/ExportButton'
import BoldWithColor from '../UI/helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'

const useStyles = makeStyles((theme) => ({
  noWrap: theme.mixins.noWrap,
  stickyTableHead: {
    ...theme.mixins.stickyTableHead,
    position: 'relative'
  }
}))

const CurrencyPositionTable: React.FC<{ rows: any }> = function({ rows }) {
  const { allRows = [], tableSumData = [] } = rows
  const classes = useStyles()
  const { reportDate } = useTypedSelector((state) => state.date)
  return (
    <TableContainer component={Paper}>
      <ExportButton id={`currency-position-${formatOneDate(reportDate)}`}/>
      <Table size="small" id={`currency-position-${formatOneDate(reportDate)}`}
        aria-label="a dense table">
        <TableCap rows={15} text={'в сумм экв.'}/>
        <TableHead className={classes.stickyTableHead}>
          <TableRow>
            <TableCell align='center' rowSpan={2}>
              <small><BoldWithColor>№</BoldWithColor></small>
            </TableCell>
            <TableCell align='center' rowSpan={2}>
              <small><BoldWithColor>Код валюты</BoldWithColor></small>
            </TableCell>
            <TableCell align='center' rowSpan={2}>
              <small><BoldWithColor>Иностранная валюта</BoldWithColor></small>
            </TableCell>
            <TableCell align='center' rowSpan={2}>
              <small><BoldWithColor>Требования банка в иностранной валюте, всего
                (в единицах ин. валюты)</BoldWithColor></small>
            </TableCell>
            <TableCell align='center' colSpan={2}>
              <small><BoldWithColor>в том числе</BoldWithColor></small>
            </TableCell>
            <TableCell align='center' rowSpan={2}>
              <small><BoldWithColor>Обязательства банка в иностранной валюте,
                всего (в единицах ин.валюты)</BoldWithColor></small>
            </TableCell>
            <TableCell align='center' colSpan={2}>
              <small><BoldWithColor>в том числе</BoldWithColor></small>
            </TableCell>
            <TableCell align='center' rowSpan={2}>
              <small><BoldWithColor>Сумма сформированного банковского капитала в
                иностранной валюте</BoldWithColor></small>
            </TableCell>
            <TableCell align='center' rowSpan={2}>
              <small><BoldWithColor>Открытая валютная позиция (в единицах
                ин.валюты,+,-)</BoldWithColor></small>
            </TableCell>
            <TableCell align='center' rowSpan={2}>
              <small><BoldWithColor>Курс иностранной
                валюты</BoldWithColor></small>
            </TableCell>
            <TableCell align='center' colSpan={2}>
              <small><BoldWithColor>Открытая валютная позиция в сумовом
                эквиваленте (сумов)</BoldWithColor></small>
            </TableCell>
            <TableCell align='center' rowSpan={2}>
              <small><BoldWithColor>Соотношение позиций к регулятивному капиталу
                банка (в%) (мах-10%)</BoldWithColor></small>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align='center'><small><BoldWithColor>Требования
              (актив)</BoldWithColor></small></TableCell>
            <TableCell align='center'><small><BoldWithColor>Требования по
              непредвиденным обстоятельствам</BoldWithColor></small></TableCell>
            <TableCell align='center'><small><BoldWithColor>Обязательства
              (пассив)</BoldWithColor></small></TableCell>
            <TableCell align='center'><small><BoldWithColor>Обязательства по
              непредвиденным обстоятельствам</BoldWithColor></small></TableCell>
            <TableCell
              align='center'><small><BoldWithColor>длинная</BoldWithColor></small></TableCell>
            <TableCell
              align='center'><small><BoldWithColor>короткая</BoldWithColor></small></TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} align='center'>
              <small><BoldWithColor>1</BoldWithColor></small>
            </TableCell>
            <TableCell align='center'>
              <small><BoldWithColor>2=3+4</BoldWithColor></small>
            </TableCell>
            <TableCell align='center'>
              <small><BoldWithColor>3</BoldWithColor></small>
            </TableCell>
            <TableCell align='center'>
              <small><BoldWithColor>4</BoldWithColor></small>
            </TableCell>
            <TableCell align='center'>
              <small><BoldWithColor>5=6+7</BoldWithColor></small>
            </TableCell>
            <TableCell align='center'>
              <small><BoldWithColor>6</BoldWithColor></small>
            </TableCell>
            <TableCell align='center'>
              <small><BoldWithColor>7</BoldWithColor></small>
            </TableCell>
            <TableCell align='center'>
              <small><BoldWithColor>8</BoldWithColor></small>
            </TableCell>
            <TableCell align='center'>
              <small><BoldWithColor>9=2-5-8</BoldWithColor></small>
            </TableCell>
            <TableCell align='center'>
              <small><BoldWithColor>10</BoldWithColor></small>
            </TableCell>
            <TableCell align='center'>
              <small><BoldWithColor>11</BoldWithColor></small>
            </TableCell>
            <TableCell align='center'>
              <small><BoldWithColor>12</BoldWithColor></small>
            </TableCell>
            <TableCell align='center'>
              <small><BoldWithColor>13</BoldWithColor></small>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allRows.map((row: any, i: number) => (
            <TableRow hover key={`${row.currency_code}+${i}`}>
              <TableCell align='center'>{row.isTableHead ? <b>{i + 1}</b> : i +
                1}</TableCell>
              <TableCell align='center'>{row.isTableHead ?
                <b>{row.CURRENCY_CODE}</b> : row.CURRENCY_CODE}</TableCell>
              <TableCell className={classes.noWrap}
                align="left">{row.isTableHead ? <b>{formatNumber(
                    row.CURRENCY_NAME, true)}</b> : formatNumber(row.CURRENCY_NAME,
                        true)}</TableCell>
              <TableCell className={classes.noWrap}
                align='center'>{row.isTableHead ? <b>{formatNumber(
                    row.RCC, true)}</b> : formatNumber(row.RCC, true)}</TableCell>
              <TableCell className={classes.noWrap}
                align='center'>{row.isTableHead ? <b>{formatNumber(
                    row.REQUIREMENTS, true)}</b> : formatNumber(row.REQUIREMENTS,
                        true)}</TableCell>
              <TableCell className={classes.noWrap}
                align='center'>{row.isTableHead ? <b>{formatNumber(
                    row.CONTINGENCY_CLAIMS, true)}</b> : formatNumber(
                        row.CONTINGENCY_CLAIMS, true)}</TableCell>
              <TableCell className={classes.noWrap}
                align='center'>{row.isTableHead ? <b>{formatNumber(
                    row.L_CL, true)}</b> : formatNumber(row.L_CL, true)}</TableCell>
              <TableCell className={classes.noWrap}
                align='center'>{row.isTableHead ? <b>{formatNumber(
                    row.LIABILITIES, true)}</b> : formatNumber(row.LIABILITIES,
                        true)}</TableCell>
              <TableCell className={classes.noWrap}
                align='center'>{row.isTableHead ? <b>{formatNumber(
                    row.CONTINGENCY_LIABILITIES, true)}</b> : formatNumber(
                        row.CONTINGENCY_LIABILITIES, true)}</TableCell>
              <TableCell className={classes.noWrap}
                align='center'>{row.isTableHead ? <b>{formatNumber(
                    row.ZERO8, true)}</b> : formatNumber(row.ZERO8,
                        true)}</TableCell>
              <TableCell className={classes.noWrap}
                align='center'>{row.isTableHead ? <b>{formatNumber(
                    row.OPEN_CUR_RATE, true)}</b> : formatNumber(row.OPEN_CUR_RATE,
                        true)}</TableCell>
              <TableCell className={classes.noWrap}
                align='center'>{row.isTableHead ? <b>{formatNumber(
                    row.FOR_CURR_RATE, true)}</b> : formatNumber(row.FOR_CURR_RATE,
                        true)}</TableCell>
              <TableCell className={classes.noWrap}
                align='center'>{row.isTableHead ? <b>{formatNumber(
                    row.LONG_VAL, true)}</b> : formatNumber(row.LONG_VAL,
                        true)}</TableCell>
              <TableCell className={classes.noWrap}
                align='center'>{row.isTableHead ? <b>{formatNumber(
                    row.SHORT_VAL, true)}</b> : formatNumber(row.SHORT_VAL,
                        true)}</TableCell>
              <TableCell className={classes.noWrap} align='center'>
                {row.isTableHead ?
                  <b>{row.POS_RATIO ?
                    `${formatNumber(row.POS_RATIO, true)}%` :
                    '-'}</b> :
                  row.POS_RATIO ? `${formatNumber(row.POS_RATIO)}%` : '-'}
              </TableCell>
            </TableRow>
          ))}
          {tableSumData.map((val: any, index: number) => (
            <TableRow key={index}>
              {index === 0 && <TableCell colSpan={8} rowSpan={4}/>}
              <TableCell align='left' colSpan={4}>{formatNumber(
                  val.title)}</TableCell>
              <TableCell align='center' colSpan={2}>{formatNumber(
                  val.sum)}</TableCell>
              <TableCell align='center'>{val.percent !== 0 &&
              `${formatNumber(val.percent)}%`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default memo(CurrencyPositionTable)
