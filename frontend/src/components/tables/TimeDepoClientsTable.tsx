import React, { Fragment, memo } from 'react'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import { TableBody } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { v4 as uuid } from 'uuid'
import TableCap from '../UI/helpers/TableCap'
import { formatNumber, formatOneDate } from '../../utils'
import ExportButton from '../UI/Layout/ExportButton'
import BoldWithColor from '../UI/helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'
import DataGridDemo from './TdcWithGrid'

const useStyles = makeStyles((theme) => ({
  noWrap: theme.mixins.noWrap,
  stickyTableHead: theme.mixins.stickyTableHead
}))

const TimeDepoClientsTable: React.FC<{rows: any}> = function({ rows = [] }) {
  const classes = useStyles()
  const { reportDate } = useTypedSelector((state) => state.date)
  return (
    <Fragment>
      <DataGridDemo rows={rows.map((row: any, i: number) => ({ ...row, index: i + 1 }))}/>
    </Fragment>
  )
}

export default memo(TimeDepoClientsTable)
