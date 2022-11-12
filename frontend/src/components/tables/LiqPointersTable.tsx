import React, { Fragment, memo, useCallback } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { formatNumber, formatOneDate } from '../../utils'
import TableCap from '../helpers/TableCap'
import ExportButton from '../layout/ExportButton'
import BoldWithColor from '../helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'
import { v4 as uuid } from 'uuid'
import globalStyles from '../../styles/globalStyles'

interface LiqPointersTableProps {
	rows: any
	currentState: boolean
}

const singleColouredRow = 'Доля высоколиквидных активов в %'

const LiqPointersTable: React.FC<LiqPointersTableProps> = function ({ rows = {}, currentState = false }) {
	const { liquidityAssets = [], obligations = [] } = rows
	const { reportDate } = useTypedSelector(state => state.operDays)
	const renderTableBody = useCallback(
		(tableData: unknown[]) => (
			<TableBody>
				{tableData.map((row: any, i: number) => (
					<Fragment key={uuid()}>
						{row.indicatorName === singleColouredRow ? (
							<TableRow sx={{ backgroundColor: '#b4c6cf' }}>
								<TableCell align="center">
									<b>{row.count}</b>
								</TableCell>
								<TableCell>
									<b>{row.indicatorName}</b>
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									<b>{formatNumber(row.total)}%</b>
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									<b>{formatNumber(row.natCurr)}%</b>
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									<b>{formatNumber(row.forCurr)}%</b>
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									<b>{formatNumber(row.usaDollar)}%</b>
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									<b>{formatNumber(row.evro)}%</b>
								</TableCell>
							</TableRow>
						) : (
							<TableRow hover>
								<TableCell align="center">{row['isTableHead'] ? <b>{row.count}</b> : row.count}</TableCell>
								<TableCell align="left">
									{row['isTableHead'] ? <b>{row.indicatorName}</b> : row.indicatorName}
								</TableCell>
								<TableCell sx={globalStyles.noWrap} align="center">
									{row['isTableHead'] ? <b>{formatNumber(row.total)}</b> : formatNumber(row.total)}
								</TableCell>
								<TableCell sx={globalStyles.noWrap} align="center">
									{row['isTableHead'] ? (
										<b>{formatNumber(row['natCurr'], true)}</b>
									) : (
										formatNumber(row['natCurr'], true)
									)}
								</TableCell>
								<TableCell sx={globalStyles.noWrap} align="center">
									{row['isTableHead'] ? (
										<b>{formatNumber(row['forCurr'], true)}</b>
									) : (
										formatNumber(row['forCurr'], true)
									)}
								</TableCell>
								<TableCell sx={globalStyles.noWrap} align="center">
									{row['isTableHead'] ? (
										<b>{formatNumber(row['usaDollar'], true)}</b>
									) : (
										formatNumber(row['usaDollar'], true)
									)}
								</TableCell>
								<TableCell sx={globalStyles.noWrap} align="center">
									{row['isTableHead'] ? <b>{formatNumber(row['evro'], true)}</b> : formatNumber(row['evro'], true)}
								</TableCell>
							</TableRow>
						)}
					</Fragment>
				))}
			</TableBody>
		),
		[]
	)
	return (
		<TableContainer component={Paper}>
			<ExportButton id={`liquidity-pointers-${currentState ? 'realtime' : formatOneDate(reportDate)}`} />
			<Table
				size="small"
				id={`liquidity-pointers-${currentState ? 'realtime' : formatOneDate(reportDate)}`}
				tableexport-key={`liquidity-pointers-${currentState ? 'realtime' : formatOneDate(reportDate)}`}
				aria-label="a dense table"
			>
				<TableCap rows={7} text={'млн.сум'} />
				<TableHead sx={globalStyles.stickyTableHead}>
					<TableRow>
						<TableCell align="center">
							<BoldWithColor>№</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>Статья баланса</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>Итого</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>
								Национальная <br /> валюта
							</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>
								Иностранная валюта <br /> в суммовом эквиваленте
							</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>Долл. США</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>Евро</BoldWithColor>
						</TableCell>
					</TableRow>
				</TableHead>
				{/* ЛИКВИДНЫЕ АКТИВЫ*/}
				{renderTableBody(liquidityAssets)}
				{/* ОБЯЗАТЕЛЬСТВА ДО ВОСТРЕБОВАНИЯ*/}
				{renderTableBody(obligations)}
			</Table>
		</TableContainer>
	)
}

export default memo(LiqPointersTable)
