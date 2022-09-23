import React, { memo } from 'react'
import { Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import TableCell from '@mui/material/TableCell'
import { v4 as uuid } from 'uuid'
import { formatNumber, formatOneDate } from '../../../../utils'
import ExportButton from '../ExportButton'
import BoldWithColor from '../../helpers/BoldWithColor'
import useTypedSelector from '../../../../hooks/useTypedSelector'

const useStyles = makeStyles((theme) => ({
  noWrap: theme.mixins.noWrap,
  clientName: {
    maxWidth: 130,
    fontSize: 13
  },
  tableHeader: {
    backgroundColor: ({ color }: {color: string}) => color,
    color: '#fff'
  },
  tableCard: {
    maxHeight: '700px'
  },
  stickyTableHead: theme.mixins.stickyTableHead
}))

interface TopDepositCardProps {
    data: any
    color: string
    currency: string
    title: string
}

const TopDepositCard: React.FC<TopDepositCardProps> = ({ data = [], color = '#eee', currency = '', title = 'demo-title' }) => {
  const classes = useStyles({ color })
  while (data.length < 20) {
    data.push({})
  }
  const { reportDate } = useTypedSelector((state) => state.date)
  return (
    <TableContainer component={Paper} classes={{ root: classes.tableCard }}>
      <ExportButton id={`${title}-${currency}-${formatOneDate(reportDate)}`}/>
      <Table size='small' id={`${title}-${currency}-${formatOneDate(reportDate)}`}>
        <TableHead className={classes.stickyTableHead}>
          <TableRow>
            <TableCell>{''}</TableCell>
            <TableCell align='center'><BoldWithColor>Наименование клиентов</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>{currency}</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>%</BoldWithColor></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((d: any, i: number) => (<TableRow hover key={uuid()}>
            <TableCell align='center'>{i+1}</TableCell>
            <TableCell className={classes.clientName}>{d['NAME']}</TableCell>
            <TableCell align='center' className={classes.noWrap}>{formatNumber(d['SALDO_OUT'])}</TableCell>
            <TableCell align='center'>{d['PERCENT'] && `${formatNumber(d['PERCENT'])}%`}</TableCell>
          </TableRow>))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default memo(TopDepositCard)
