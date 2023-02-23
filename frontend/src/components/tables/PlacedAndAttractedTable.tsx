import React, { Fragment, memo } from 'react'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import TableCap from '../helpers/TableCap'
import { Grid, TableBody, TableHead, TableRow } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import { formatNumber, formatOneDate } from '../../utils'
import InvolvedFunds from '../charts/dashboard/placedAndAttracted/InvolvedFunds'
import PlacedFunds from '../charts/dashboard/placedAndAttracted/PlacedFunds'
import ExportButton from '../layout/ExportButton'
import BoldWithColor from '../helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'
import { v4 as uuid } from 'uuid'
import globalStyles from '../../styles/globalStyles'

function getFundCategoryAndSeries(fundData: any = []) {
	let fundChartData = [...fundData]
		.filter(f => f['forChart'])
		.map((f: any) => ({ category: f['fundName'], sum: f['sum'] }))
	const involvedChartLeftData =
		([...fundData].pop() || {})['sum'] - fundChartData.reduce((acc, val) => (acc += val['sum']), 0)
	fundChartData = fundChartData
		.concat({ category: 'Прочие', sum: involvedChartLeftData })
		.map(f => ({ ...f, sum: +(f['sum'] / Math.pow(10, 6)).toFixed(2) }))
	const fundCategories = fundChartData.map(f => f['category'])
	const fundSeries = fundChartData.map(f => f['sum'])
	return [fundCategories, fundSeries]
}

interface PlacedAndAttractedTableProps {
	forDashboard: boolean
}

function Charts() {
	const { plat } = useTypedSelector(state => state.plat)
	const { involvedFunds = [], placedFunds = [] } = plat
	const [involvedCategories, involvedSeries] = getFundCategoryAndSeries(involvedFunds)
	const [placedCategories, placedSeries] = getFundCategoryAndSeries(placedFunds)
	return (
		<Fragment>
			<Grid container spacing={2} justifyContent="space-between">
				<Grid item xs={12} sm={6}>
					<PlacedFunds series={placedSeries} categories={placedCategories} />
				</Grid>
				<Grid item xs={12} sm={6}>
					<InvolvedFunds series={involvedSeries} categories={involvedCategories} />
				</Grid>
			</Grid>
		</Fragment>
	)
}

const PlacedAndAttractedTable: React.FC<PlacedAndAttractedTableProps> = ({ forDashboard = false }) => {
	const { plat } = useTypedSelector(state => state.plat)
	const { reportDate } = useTypedSelector(state => state.operDays)
	const { involvedFunds = [], placedFunds = [] } = plat
	if (forDashboard) return <Charts />
	return (
		<Fragment>
			<TableContainer component={Paper} sx={{ marginBottom: '20px' }}>
				<ExportButton id={`placed-attracted-${formatOneDate(reportDate)}`} />
				<Table id={`placed-attracted-${formatOneDate(reportDate)}`} size="small" aria-label="a dense table">
					<TableCap text="тыс. сум" rows={8} />
					<TableHead sx={globalStyles.stickyTableHead}>
						<TableRow>
							<TableCell align="center" colSpan={4}>
								<BoldWithColor>РАЗМЕЩЕННЫЕ СРЕДСТВА</BoldWithColor>
							</TableCell>
							<TableCell align="center" colSpan={4}>
								<BoldWithColor>ПРИВЛЕЧЕННЫЕ СРЕДСТВА</BoldWithColor>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<BoldWithColor>Наименование</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Балансовые счета</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Сумма</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>в % к итогу</BoldWithColor>
							</TableCell>
							<TableCell>
								<BoldWithColor>Наименование</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Балансовые счета</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Сумма</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>в % к итогу</BoldWithColor>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{placedFunds.map((f: any, i: number) => (
							<TableRow hover key={uuid()}>
								<TableCell>{f['fundName']}</TableCell>
								<TableCell align="center">{f['balanceCode']}</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(f['sum'])}
								</TableCell>
								<TableCell align="center">{f['percent']}</TableCell>
								<TableCell>{involvedFunds[i]['fundName']}</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{involvedFunds[i]['balanceCode']}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(involvedFunds[i]['sum'])}
								</TableCell>
								<TableCell align="center">{involvedFunds[i]['percent']}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Charts />
		</Fragment>
	)
}

export default memo(PlacedAndAttractedTable)
