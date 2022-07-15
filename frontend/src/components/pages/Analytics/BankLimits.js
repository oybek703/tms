import React, { Fragment, useCallback, useState } from 'react'
import {
  makeStyles,
  Paper,
  TableBody,
  TableContainer,
  TableRow
} from '@material-ui/core'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import BoldWithColor from '../../UI/helpers/BoldWithColor'
import {v4 as uuid} from 'uuid'
import { formatNumber } from '../../../utils'
import ProgressBar from '../../UI/Layout/ProgressBar'
import ButtonTabs from '../../UI/Layout/Tabs/ButtonsTab'

const useStyles = makeStyles(theme => ({
  noWrap: theme.mixins.noWrap,
  stickyTableHead: theme.mixins.stickyTableHead,
  stickyCol: {
    ...theme.mixins.stickyCol,
    backgroundColor: '#ccc'
  },
  blueBackground: theme.mixins.blueBackground
}))

const titles = [
  {title: 'Иностранные банки', code: 'foreign'},
  {title: 'Локальные банки', code: 'local'}
]

const BankLimits = ({rows = []}) => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState('foreign')
  const handleChange = useCallback(code => setExpanded(code), [])
  return (
    <Fragment>
      <ButtonTabs handleChange={handleChange} active={expanded} titles={titles}/>
      {/*{*/}
      {/*  expanded === 'local' */}
      {/*    ? '' */}
      {/*    :*/}
          <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead className={classes.stickyTableHead}>
            <TableRow>
              <TableCell align='center'><BoldWithColor>№</BoldWithColor></TableCell>
              <TableCell align='center'>
                <BoldWithColor>Наименование</BoldWithColor>
              </TableCell>
              <TableCell align='center'><BoldWithColor>Остаток</BoldWithColor></TableCell>
              <TableCell align='center'><BoldWithColor>Лимить - 22%</BoldWithColor></TableCell>
              <TableCell align='center'><BoldWithColor>Разница</BoldWithColor></TableCell>
              <TableCell align='center'><BoldWithColor>(%) лимита</BoldWithColor></TableCell>
              <TableCell align='center'><BoldWithColor>Лимить - 24%</BoldWithColor></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => <TableRow key={uuid()}>
              <TableCell align='center'>
                <b>{index+1}</b>
              </TableCell>
              <TableCell className={classes.noWrap}><b>{row['NAME']}</b></TableCell>
              <TableCell align='center' className={classes.noWrap}>{formatNumber(row['SALDO_EQUIVAL_OUT'])}</TableCell>
              <TableCell align='center' className={classes.noWrap}>{formatNumber(row['FOREIGN_CURRENCY_22'])}</TableCell>
              <TableCell align='center' className={classes.noWrap}>{formatNumber(row['DIFFER'])}</TableCell>
              <TableCell align='center' className={classes.noWrap}>
                <ProgressBar value={Number(row['PROGRESS_PERCENT']).toFixed(2)}/>
              </TableCell>
              <TableCell align='center' className={classes.noWrap}>{formatNumber(row['FOREIGN_CURRENCY_24'])}</TableCell>
            </TableRow>)}
          </TableBody>
        </Table>
      </TableContainer>
      {/*}*/}
    </Fragment>
  )
}

export default BankLimits