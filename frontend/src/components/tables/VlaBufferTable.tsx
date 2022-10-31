import React, { Fragment, memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { formatNumber, formatOneDate } from '../../utils'
import ExportButton from '../UI/Layout/ExportButton'
import BoldWithColor from '../UI/helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'
import { v4 as uuid } from 'uuid'
import Grid from '@mui/material/Grid'
import TableCap from '../UI/helpers/TableCap'
import globalStyles from '../../styles/globalStyles'

interface IVlaBufferRowData {
	indicatorName: string
	totalPercent: number
	total: number
	uzsPercent: number
	uzs: number
	foreignPercent: number
	foreign: number
}

interface VLaBufferTableProps {
	rows: {
		liquidityAssets: IVlaBufferRowData[]
		liabilitiesOnDemand: IVlaBufferRowData[]
	}
}

function VlaBufferTableBody({ rows = [] }: { rows: IVlaBufferRowData[] }) {
	return (
		<TableBody>
			{rows.map((row: IVlaBufferRowData) => (
				<TableRow key={uuid()}>
					<TableCell>
						<b>{row['indicatorName']}</b>
					</TableCell>
					<TableCell align="center">{row['totalPercent'] && `${formatNumber(row['totalPercent'])} %`}</TableCell>
					<TableCell align="center" sx={globalStyles.noWrap}>
						{formatNumber(row['total'])}
					</TableCell>
					<TableCell align="center">{row['uzsPercent'] && `${formatNumber(row['uzsPercent'])} %`}</TableCell>
					<TableCell align="center" sx={globalStyles.noWrap}>
						{formatNumber(row['uzs'])}
					</TableCell>
					<TableCell align="center">{row['foreignPercent'] && `${formatNumber(row['foreignPercent'])} %`}</TableCell>
					<TableCell align="center" sx={globalStyles.noWrap}>
						{formatNumber(row['foreign'])}
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	)
}

const VLaBufferTable: React.FC<VLaBufferTableProps> = ({ rows = {} }) => {
	const { liquidityAssets = [], liabilitiesOnDemand = [] } = rows
	const { reportDate } = useTypedSelector(state => state.operDays)
	const forFOR = (liabilitiesOnDemand[0] || {}).total * 0.7
	const forDemandDeposits = (liquidityAssets[0] || {}).total - forFOR
	return (
		<Fragment>
			<TableContainer component={Paper}>
				<ExportButton id={`liquidity-assets-${formatOneDate(reportDate)}`} />
				<Table id={`liquidity-assets-${formatOneDate(reportDate)}`} size="small" aria-label="a dense table">
					<TableCap rows={7} text={'сум. экв.'} />
					<TableHead sx={globalStyles.stickyTableHead}>
						<TableRow>
							<TableCell align="center">
								<BoldWithColor>ЛИКВИДНЫЕ АКТЫВЫ</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Доля в совокупном активе</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Итого</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Доля в совокупном активе в нац. валюте</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Национальная валюта</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Доля в совокупном активе в иност. валюте</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Иностранном валюте</BoldWithColor>
							</TableCell>
						</TableRow>
					</TableHead>
					<VlaBufferTableBody rows={liquidityAssets} />
				</Table>
			</TableContainer>
			<Grid sx={{ margin: '20px 0' }} />
			<TableContainer component={Paper}>
				<ExportButton id={`liabilities-on-demand-${formatOneDate(reportDate)}`} />
				<Table id={`liabilities-on-demand-${formatOneDate(reportDate)}`} size="small" aria-label="a dense table">
					<TableCap rows={7} text={'сум. экв.'} />
					<TableHead sx={globalStyles.stickyTableHead}>
						<TableRow>
							<TableCell align="center">
								<BoldWithColor>ОБЯЗАТЕЛСТВА ДО ВОСТРЕБОВАНИЯ</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Доля в совокупном пассиве</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Итого</BoldWithColor>
							</TableCell>
							<TableCell align="center" />
							<TableCell align="center">
								<BoldWithColor>Национальная валюта</BoldWithColor>
							</TableCell>
							<TableCell align="center" />
							<TableCell align="center">
								<BoldWithColor>Иностранном валюте(долл.США)</BoldWithColor>
							</TableCell>
						</TableRow>
					</TableHead>
					<VlaBufferTableBody rows={liabilitiesOnDemand} />
				</Table>
			</TableContainer>
			<Grid sx={{ margin: '20px 0', maxWidth: '40%' }}>
				<Table size="small">
					<TableHead sx={globalStyles.stickyTableHead}>
						<TableRow>
							<TableCell align="left">
								<BoldWithColor>
									<i>Для довостребовние (70% кор.счет)</i>
								</BoldWithColor>
							</TableCell>
							<TableCell align="right">
								<BoldWithColor>
									<i>{formatNumber(forFOR)}</i>
								</BoldWithColor>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left">
								<BoldWithColor>
									<i>Для ФОР</i>
								</BoldWithColor>
							</TableCell>
							<TableCell align="right">
								<BoldWithColor>
									<i>{formatNumber(forDemandDeposits)}</i>
								</BoldWithColor>
							</TableCell>
						</TableRow>
					</TableHead>
				</Table>
			</Grid>
		</Fragment>
	)
}

export default memo(VLaBufferTable)
