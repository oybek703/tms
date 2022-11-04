import React, { memo } from 'react'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { formatOneDate } from '../../utils'
import TableCap from '../UI/helpers/TableCap'
import ExportButton from '../UI/Layout/ExportButton'
import BoldWithColor from '../UI/helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'
import globalStyles from '../../styles/globalStyles'
import { TableBody, Typography } from '@mui/material'

interface CompetitiveAnalysisProps {
	rows: any
}

const CompetitiveAnalysisTable: React.FC<CompetitiveAnalysisProps> = function ({ rows = {} }) {
	const { reportDate } = useTypedSelector(state => state.operDays)
	console.log(rows)
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
						<TableCell align="center">1 янв</TableCell>
						<TableCell align="center">1 апр</TableCell>
						<TableCell align="center">1 июл</TableCell>
						<TableCell align="center">1 окт</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default memo(CompetitiveAnalysisTable)
