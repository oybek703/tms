import React, { Fragment, ReactNode, useCallback, useMemo, useState } from 'react'
import { Paper, TableBody, TableContainer, TableRow } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import BoldWithColor from '../../../helpers/BoldWithColor'
import { v4 as uuid } from 'uuid'
import { formatNumber } from '../../../../../utils'
import ProgressBar from '../../ProgressBar'
import ButtonTabs from '../../Tabs/ButtonsTab'
import Grid from '@mui/material/Grid'
import LimitsMenu from './LimitsMenu'

const useStyles = makeStyles(theme => ({
  noWrap: theme.mixins.noWrap,
  stickyTableHead: theme.mixins.stickyTableHead,
  exceeded: {
    color: 'red'
  },
  blueBackground: theme.mixins.blueBackground
}))

interface NoWrapCellProps {
	celldata: number | ReactNode
	colSpan?: number
	style?: any
}

const NoWrapCell: React.FC<NoWrapCellProps> = props => {
  const classes = useStyles()
  const { celldata, colSpan = 0 } = props
  return <TableCell colSpan={colSpan} {...props} align='center'
    className={classes.noWrap}>
    {typeof celldata === 'number' ? formatNumber(celldata) : celldata}
  </TableCell>
}

function ProgressOrText({ celldata = '0', showNumber = false }: {celldata: limitPercent, showNumber?: boolean}) {
  const classes = useStyles()
  return (
		celldata === 'no_limit' ?
			<i>Лимит не установлен.</i> :
			celldata === 'exceeded' ?
				<b className={classes.exceeded}><i>Лимит нарушен.</i></b> :
				<ProgressBar showNumber={showNumber} value={+Number(celldata).toFixed(2)} />
  )
}

function BankLimitsTableHead() {
  const classes = useStyles()
  return (
    <TableHead className={classes.stickyTableHead}>
      <TableRow>
        <TableCell align='center'><BoldWithColor>№</BoldWithColor></TableCell>
        <TableCell align='center'>
          <BoldWithColor>Наименование</BoldWithColor>
        </TableCell>
        <TableCell align='center'><BoldWithColor>Остаток корр. счетов</BoldWithColor></TableCell>
        <TableCell align='center'><BoldWithColor>Лимит - 22%</BoldWithColor></TableCell>
        <TableCell align='center'><BoldWithColor>Разница</BoldWithColor></TableCell>
        <TableCell align='center'><BoldWithColor>(%) лимита</BoldWithColor></TableCell>
        <TableCell align='center'><BoldWithColor>Лимит - 24%</BoldWithColor></TableCell>
      </TableRow>
    </TableHead>
  )
}

interface BanksProps {
	rows: IBankCell[]
}

function sortLimitsArray<T extends IBankCell>(array: T[]): T[] {
  let sortedRows: T[] = []
  const nullLimits: T[] = []
  const noLimits: T[] = []
  const exceededLimits: T[] = []
  const hasLimits: T[] = []
  if (array.length) {
    array.forEach(row => {
      switch (row.limitPercent22) {
        case 'no_limit':
          noLimits.unshift(row)
          break
        case 'exceeded':
          exceededLimits.unshift(row)
          break
        case null:
          nullLimits.unshift(row)
          break
        default:
          hasLimits.push(row)
      }
    })
    sortedRows = [
      ...exceededLimits,
      ...hasLimits.sort((a, b) => (+b.limitPercent22) - (+a.limitPercent22)),
      ...noLimits,
      ...nullLimits
    ]
  }
  return sortedRows
}

const BanksTable: React.FC<BanksProps> = ({ rows = [] }) => {
  if (JSON.stringify(rows) === JSON.stringify({})) rows = []
  const sortedRows: IBankCell[] = useMemo<IBankCell[]>(() => sortLimitsArray(rows), [rows])
  return <TableContainer component={Paper}>
    <Table size='small'>
      <BankLimitsTableHead />
      <TableBody>
        {sortedRows.map((row, index) => <TableRow hover key={uuid()}>
          <TableCell align='center'><b>{index + 1}</b></TableCell>
          <TableCell><b>{row['bankName']}</b></TableCell>
          <NoWrapCell celldata={row['saldo']} />
          <NoWrapCell celldata={row['limit22']} />
          <NoWrapCell celldata={row['differ']} />
          <NoWrapCell celldata={<Fragment>
            {+row['limitPercent22'] >= 100 ?
							<Grid container justifyContent='space-between' alignItems='center'>
							  <Grid style={{ width: '96%' }}>
							    <ProgressOrText celldata={row['limitPercent22']} />
							  </Grid>
							  <Grid style={{ width: '4%' }}>
							    <LimitsMenu innerData={
							      <Table>
							        <TableHead>
							          <TableRow>
							            <TableCell><b>Процент лимита - 22%</b></TableCell>
							            <TableCell><b>Процент лимита - 24%</b></TableCell>
							          </TableRow>
							        </TableHead>
							        <TableBody>
							          <TableRow>
							            <NoWrapCell celldata={<ProgressOrText showNumber celldata={row['limitPercent22']} />} />
							            <NoWrapCell celldata={<ProgressOrText showNumber celldata={row['limitPercent24']} />} />
							          </TableRow>
							        </TableBody>
							      </Table>
							    } />
							  </Grid>
							</Grid> :
							<ProgressOrText celldata={row['limitPercent22']} />}
          </Fragment>} />
          <NoWrapCell celldata={row['limit24']} />
        </TableRow>)}
      </TableBody>
    </Table>
  </TableContainer>
}

const titles = [
  { title: 'Локальные банки', code: 'local' },
  { title: 'Иностранные банки', code: 'foreign' }
]

type limitPercent = string | 'no_limit' | 'exceeded'

interface IBankCell {
	bankName: string
	saldo: number
	limit22: number
	differ: number
	limitPercent22: limitPercent
	limitPercent24: limitPercent
	limit24: number
}

interface BankLimitsProps {
	bankLimits: {
		foreignBanks: IBankCell[]
		localBanks: IBankCell[]
	}
}

const BankLimits: React.FC<BankLimitsProps> = ({ bankLimits }) => {
  const { foreignBanks = [], localBanks = [] } = bankLimits
  const [expanded, setExpanded] = useState<string>(localStorage.getItem('bankLimitsActiveTab') || 'local')
  const handleChange = useCallback((code: string) => {
    setExpanded(code)
    localStorage.setItem('bankLimitsActiveTab', code)
  }, [])
  return (
    <Fragment>
      <ButtonTabs handleChange={handleChange} active={expanded} titles={titles} />
      {
				expanded === 'local' ?
					<BanksTable rows={localBanks} /> :
					<BanksTable rows={foreignBanks} />
      }
    </Fragment>
  )
}

export default BankLimits
