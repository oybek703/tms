import React, { Fragment, memo } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

import { formatNumber, formatOneDate } from '../../utils'
import Grid from '@material-ui/core/Grid'
import GMLiabilities from '../charts/GM/GMLiabilities'
import GMClassification from '../charts/GM/GMClassification'
import { makeStyles } from '@material-ui/core'
import ExportButton from '../UI/Layout/ExportButton'
import BoldWithColor from '../UI/helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'

function sumByCode(array = [], code = '') {
  let usd = 0; let eur = 0; let rub = 0; let uzs = 0
  array.forEach((v) => {
    if (v['CHECK_ACCOUNT'] === code && v['CODE_CURRENCY'] === '840') {
      usd+=v['PAR_VALUE']
    }
    if (v['CHECK_ACCOUNT'] === code && v['CODE_CURRENCY'] === '978') {
      eur+=v['PAR_VALUE']
    }
    if (v['CHECK_ACCOUNT'] === code && v['CODE_CURRENCY'] === '643') {
      rub+=v['PAR_VALUE']
    }
    if (v['CHECK_ACCOUNT'] === code && v['CODE_CURRENCY'] === '000') {
      uzs+=v['PAR_VALUE']
    }
  })
  return [usd, eur, rub, uzs].map((n) => +(n/Math.pow(10, 6)).toFixed(1))
}

const useStyles = makeStyles((theme) => ({
  paddingBottom0: theme.mixins.paddingBottom0,
  stickyTableHead: theme.mixins.stickyTableHead,
  blueBackground: {
    ...theme.mixins.blueBackground,
    backgroundColor: '#b4c6cf'
  }
}))

const GMTable: React.FC<{rows: any}> = function({ rows = {} }) {
  const classes = useStyles()
  const { reportDate } = useTypedSelector((state) => state.date)
  const { tableData = [], accredetiv = { acs: [], others: [] }, currRates = [] } = rows
  let uzsSum = 0; let usdSum = 0; let eurSum = 0; let rubSum = 0
  tableData.forEach((r: any) => {
    const codeCurrency = r['CODE_CURRENCY']
    const parValue = r['PAR_VALUE']
    switch (codeCurrency) {
      case '000':
        if (r['CHECK_ACCOUNT']) {
          return uzsSum += parValue
        }
        return uzsSum
      case '840':
        return usdSum+=parValue
      case '643':
        return rubSum+=parValue
      case '978':
        return eurSum+=parValue
      default:
        return 0
    }
  })
  const sums = [uzsSum, usdSum, eurSum, rubSum]
  const accountCodes = ['20214', '20414', '20614', '22602', '22613', '22614', '22624']
  const sumByCodes = {
    ...accountCodes.reduce((acc: any, val: any) => {
      acc[val] = sumByCode(tableData, val)
      return acc
    }, {})
  }
  let classificationSumRow = [0, 0, 0, 0]
  for (const code in sumByCodes) {
    if (sumByCodes.hasOwnProperty(code)) {
      classificationSumRow[0]+=sumByCodes[code][0]
      classificationSumRow[1]+=sumByCodes[code][1]
      classificationSumRow[2]+=sumByCodes[code][2]
      classificationSumRow[3]+=sumByCodes[code][3]
    }
  }
  classificationSumRow = classificationSumRow.map((v) => +v.toFixed(1))
  const classificationLastRow = classificationSumRow
      .map((r, i) => {
        if (currRates[i]) {
          return r*currRates[i]
        }
        return r
      }).map((v) => +v.toFixed(1))
  const gmLiabilities = [
    ...(accredetiv.acs || []).map(Number),
    ...(accredetiv.others || []).map((v: any) => ((+v['par_value'])))
  ].map((v) => Math.round(Math.abs(v)))
  return (
    <Fragment>
      <Grid container spacing={2} justifyContent='space-between'>
        <Grid item xs={6}>
          <Fragment>
            <Table size ='small'>
              <TableHead className={classes.stickyTableHead}>
                <TableRow>
                  <TableCell align='center'>
                    <BoldWithColor>Обязательства АО &quot;UzAuto Motors&quot; перед банком</BoldWithColor>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
            <br/>
            <TableContainer component={Paper} className={classes.paddingBottom0}>
              <Table size='small'>
                <TableHead className={classes.stickyTableHead}>
                  <TableRow>
                    <TableCell align='center'>
                      <BoldWithColor>Задолженность</BoldWithColor>
                    </TableCell>
                    <TableCell align='center'>
                      <BoldWithColor>Тип валют</BoldWithColor>
                    </TableCell>
                    <TableCell align='center'>
                      <BoldWithColor>Сумма (в номинале)</BoldWithColor>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell rowSpan={4}>Аккредетив</TableCell>
                  </TableRow>
                  {['USD', 'EUR', 'RUB'].map((c, i) => (
                    <TableRow hover key={i}>
                      <TableCell align='center'>{c}</TableCell>
                      <TableCell align='center'>{formatNumber(Math.abs((accredetiv['acs'] || [])[i]), true)}</TableCell>
                    </TableRow>
                  ))}
                  {(accredetiv['others'] || []).map((v: any, i: number) => (
                    <TableRow key={i} className={i === 0 ? classes.blueBackground : ''}>
                      {i === 0 ? <Fragment>
                        <TableCell><b>{v['loan_name']}</b></TableCell>
                        <TableCell align='center'><b>{v['currency_name']}</b></TableCell>
                        <TableCell align='center'><b>{formatNumber(v['par_value'], true)}</b></TableCell>
                      </Fragment> : <Fragment>
                        <TableCell>{v['loan_name']}</TableCell>
                        <TableCell align='center'>{v['currency_name']}</TableCell>
                        <TableCell align='center'>{formatNumber(v['par_value'], true)}</TableCell>
                      </Fragment>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Fragment>
        </Grid>
        <Grid item container alignItems='center' justifyContent='center' xs={6}>
          <GMLiabilities series={gmLiabilities}/>
        </Grid>
        <Grid item xs={7}>
          <TableContainer component={Paper} className={classes.paddingBottom0}>
            <Table size='small'>
              <TableHead className={classes.stickyTableHead}>
                <TableRow>
                  <TableCell/>
                  <TableCell align='center'><BoldWithColor>USD</BoldWithColor></TableCell>
                  <TableCell align='center'><BoldWithColor>EUR</BoldWithColor></TableCell>
                  <TableCell align='center'><BoldWithColor>RUB</BoldWithColor></TableCell>
                  <TableCell align='center'><BoldWithColor>UZS</BoldWithColor></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['20214', '20414', '20614', '22602', '22613', '22614', '22624'].map((c, i) => (
                  <TableRow hover key={i}>
                    <TableCell align='center'>{c}</TableCell>
                    {sumByCodes[c].map((v: any, j: number) => (
                      <TableCell align='center' key={j}>{formatNumber(v)}</TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow hover>
                  <TableCell align='center'><b>Итого</b></TableCell>
                  {classificationSumRow
                      .map((v, i) =>
                        <TableCell align='center' key={i}>
                          <b>{formatNumber(v)}</b>
                        </TableCell>)}
                </TableRow>
                <TableRow hover>
                  <TableCell align='center'><b>эквива.сум</b></TableCell>
                  {classificationLastRow
                      .map((v, i) =>
                        <TableCell align='center' key={i}>
                          <b>{formatNumber(v)}</b>
                        </TableCell>)}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item container alignItems='center' justifyContent='center' xs={5}>
          <GMClassification series={classificationLastRow} data={classificationSumRow}/>
        </Grid>
      </Grid>
      <br/>
      <TableContainer component={Paper}>
        <ExportButton id={`uzAuto-GM-${formatOneDate(reportDate)}`}/>
        <Table size="small" id={`uzAuto-GM-${formatOneDate(reportDate)}`} aria-label="a dense table">
          <TableHead className={classes.stickyTableHead}>
            <TableRow>
              <TableCell align='center'><BoldWithColor>Расчетный счет</BoldWithColor></TableCell>
              <TableCell align='center'><BoldWithColor>Вид операции</BoldWithColor></TableCell>
              <TableCell align='center'><BoldWithColor>Сумма (в номинале)</BoldWithColor></TableCell>
              <TableCell align='center'><BoldWithColor>Тып валют</BoldWithColor></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row: any, i: number) => (
              <TableRow hover key={i}>
                <TableCell align='center'>{row.CHECK_ACCOUNT}</TableCell>
                <TableCell align='left'>{row.OPERATION_TYPE}</TableCell>
                <TableCell align='center'>{formatNumber(row.PAR_VALUE)}</TableCell>
                <TableCell align='center'>
                  {
                                        row.CODE_CURRENCY === '000' ?
                                            'UZS' :
                                            row.CODE_CURRENCY === '840' ?
                                            'USD' :
                                            row.CODE_CURRENCY === '978' ?
                                                'EUR' :
                                                row.CODE_CURRENCY === '643' ? 'RUB' : ''
                  }
                </TableCell>
              </TableRow>
            ))}
            {[{ title: 'ВСЕГО сум', currency: 'UZS' },
              { title: 'ВСЕГО доллар', currency: 'USD' },
              { title: 'ВСЕГО евро', currency: 'EUR' },
              { title: 'ВСЕГО рубль', currency: 'RUB' }].map((v, i) => (
              <TableRow hover key={i}>
                <TableCell>{''}</TableCell>
                <TableCell><b>{v.title}</b></TableCell>
                <TableCell align='center'><b>{formatNumber(sums[i], 'e')}</b></TableCell>
                <TableCell align='center'>{v.currency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  )
}

export default memo(GMTable)
