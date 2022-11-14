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

interface CompetitiveAnalysisProps {
	rows: {
		quarterDates: string[]
		totalData: { title: string; q1: number; q2: number; q3: number }[]
	}
}

const CompetitiveAnalysisTable: React.FC<CompetitiveAnalysisProps> = function ({ rows }) {
	const { reportDate } = useTypedSelector(state => state.operDays)
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
						<TableCell>Нац. вал. млн.</TableCell>
						{rows.quarterDates.map(date => (
							<TableCell key={uuid()} align="center">
								{date}
							</TableCell>
						))}
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default memo(CompetitiveAnalysisTable)
