import React, { memo } from 'react'
import Table from '@mui/material/Table'
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
import globalStyles from '../../styles/globalStyles'
import { TableBody, Typography } from '@mui/material'
import { v4 as uuid } from 'uuid'
import { ICompetitiveAnalysis } from '../../interfaces/ca.interface'

interface CompetitiveAnalysisProps {
	rows: ICompetitiveAnalysis
}

interface IndicatorNameCellProps {
	indicatorName: string
	tabbed?: boolean
	redBold?: boolean
}

const IndicatorNameCell: React.FC<IndicatorNameCellProps> = ({ tabbed, indicatorName, redBold }) => {
	const styles = { color: 'red', fontWeight: 'bold' }
	return (
		<TableCell sx={redBold ? styles : {}}>
			{tabbed && <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>}
			{indicatorName}
		</TableCell>
	)
}

const CompetitiveAnalysisTable: React.FC<CompetitiveAnalysisProps> = function ({ rows }) {
	const { reportDate } = useTypedSelector(state => state.operDays)
	const { quarterDates, totalData } = rows
	return (
		<TableContainer component={Paper}>
			<ExportButton id={`competitive-analysis-${formatOneDate(reportDate)}`} />
			<Table
				size="small"
				id={`competitive-analysis-${formatOneDate(reportDate)}`}
				tableexport-key={`competitive-analysis-${formatOneDate(reportDate)}`}
				aria-label="a dense table"
			>
				<TableCap rows={5} text={'млн.сум'} />
				<TableHead sx={globalStyles.stickyTableHead}>
					<TableRow>
						<TableCell colSpan={5}>
							<BoldWithColor>
								<Typography variant="h5" component="b" sx={{ fontWeight: 'bold' }}>
									Асакабанк
								</Typography>
							</BoldWithColor>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell>
							<b>Нац. вал. млн.</b>
						</TableCell>
						{quarterDates.map(date => (
							<TableCell key={uuid()} align="center">
								<b>{date}</b>
							</TableCell>
						))}
					</TableRow>
					{Object.keys(totalData).map((value, index) => {
						const { firstDate, secondDate, fourthDate, thirdDate, indicatorName, redBold, tabbed } = totalData[value]
						return (
							<TableRow key={uuid()}>
								<IndicatorNameCell indicatorName={indicatorName} tabbed={tabbed} redBold={redBold} />
								<TableCell align="center">{formatNumber(firstDate)}</TableCell>
								<TableCell align="center">{formatNumber(secondDate)}</TableCell>
								<TableCell align="center">{formatNumber(thirdDate)}</TableCell>
								<TableCell align="center">{formatNumber(fourthDate)}</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default memo(CompetitiveAnalysisTable)
