import React, { memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { formatDate, formatNumber } from '../../utils'
import TableCap from '../helpers/TableCap'
import ExportButton from '../layout/ExportButton'
import BoldWithColor from '../helpers/BoldWithColor'
import globalStyles from '../../styles/globalStyles'
import useTypedSelector from '../../hooks/useTypedSelector'

const ProfitAndLostTable = () => {
	const { profitAndLost } = useTypedSelector(state => state.profitAndLost)
	const { reportDate } = useTypedSelector(state => state.operDays)
	const { yearFirstDate, monthFirstDate, selectedDate } = formatDate(reportDate)
	return (
		<TableContainer component={Paper}>
			<ExportButton id={`profit-and-lost-${selectedDate}`} />
			<Table id={`profit-and-lost-${selectedDate}`} size="small" aria-label="a dense table">
				<TableCap rows={7} text={'млрд. сум'} />
				<TableHead sx={globalStyles.stickyTableHead}>
					<TableRow>
						<TableCell align="center">
							<BoldWithColor>№</BoldWithColor>
						</TableCell>
						<TableCell>
							<BoldWithColor>Наименование показателей</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>{yearFirstDate}</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>{monthFirstDate}</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>{selectedDate}</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>Ежемесячная разница</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>Ежемесячная разница (%)</BoldWithColor>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{profitAndLost.map((row: any, index: number) => (
						<TableRow hover key={index}>
							<TableCell align="center">
								<b>{row['count']}</b>
							</TableCell>
							<TableCell>{row['isTableHead'] ? <b>{row['indicatorName']}</b> : row['indicatorName']}</TableCell>
							<TableCell align="center">
								{row['isTableHead'] ? <b>{formatNumber(row['yearBegin'])}</b> : formatNumber(row['yearBegin'])}
							</TableCell>
							<TableCell align="center">
								{row['isTableHead'] ? <b>{formatNumber(row['monthBegin'])}</b> : formatNumber(row['monthBegin'])}
							</TableCell>
							<TableCell align="center">
								{row['isTableHead'] ? <b>{formatNumber(row['selectedDate'])}</b> : formatNumber(row['selectedDate'])}
							</TableCell>
							<TableCell align="center">
								{row['isTableHead'] ? <b>{formatNumber(row['differ'], true)}</b> : formatNumber(row['differ'], true)}
							</TableCell>
							<TableCell align="center">{formatNumber(row['differPercent'], true)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default memo(ProfitAndLostTable)
