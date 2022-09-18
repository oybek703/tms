import React, { memo } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { formatNumber, formatOneDate } from '../../utils'
import ExportButton from '../UI/Layout/ExportButton'
import { makeStyles } from '@material-ui/core'
import BoldWithColor from '../UI/helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'
import { v4 as uuid } from 'uuid'

const useStyles = makeStyles((theme) => ({
  noWrap: theme.mixins.noWrap,
  stickyTableHead: theme.mixins.stickyTableHead
}))

function VLaBufferTable({ rows = [] }) {
  const classes = useStyles()
  const { reportDate } = useTypedSelector(state => state.date)
  return (
    <TableContainer component={Paper}>
      <ExportButton id={`deposits-by-deadline-${formatOneDate(reportDate)}`}/>
      <Table id={`deposits-by-deadline-${formatOneDate(reportDate)}`}
        size="medium" aria-label="a dense table">
        <TableHead className={classes.stickyTableHead}>
          <TableRow>
            <TableCell align='center'><BoldWithColor>ЛИКВИДНЫЕ АКТЫВЫ</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Доля в совокупном активе</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Итого</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Доля в совокупном активе в нац. валюте</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Национальная валюта</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Доля в совокупном активе в иност. валюте</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Иностранном валюте(долл.США)</BoldWithColor></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => <TableRow key={uuid()}>
            <TableCell><b>{row['indicatorName']}</b></TableCell>
            <TableCell align='center'>{row['totalPercent'] && `${formatNumber(row['totalPercent'])} %`}</TableCell>
            <TableCell align='center' className={classes.noWrap}>{formatNumber(row['total'])}</TableCell>
            <TableCell align='center'>{row['uzsPercent'] && `${formatNumber(row['uzsPercent'])} %`}</TableCell>
            <TableCell align='center' className={classes.noWrap}>{formatNumber(row['uzs'])}</TableCell>
            <TableCell align='center'>{row['foreignPercent'] && `${formatNumber(row['foreignPercent'])} %`}</TableCell>
            <TableCell align='center' className={classes.noWrap}>{formatNumber(row['foreign'])}</TableCell>
          </TableRow>)}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default memo(VLaBufferTable)
