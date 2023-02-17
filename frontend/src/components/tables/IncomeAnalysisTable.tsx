import React, { memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import Paper from '@mui/material/Paper'
import { formatNumber, formatOneDate } from '../../utils'
import TableCap from '../helpers/TableCap'
import ExportButton from '../layout/ExportButton'
import BoldWithColor from '../helpers/BoldWithColor'
import TableRow from '@mui/material/TableRow'
import useTypedSelector from '../../hooks/useTypedSelector'
import globalStyles from '../../styles/globalStyles'

const IncomeAnalysisTable = function () {
	const { reportDate } = useTypedSelector(state => state.operDays)
	const { incomeAnalysis } = useTypedSelector(state => state.incomeAnalysis)
	console.log(incomeAnalysis)
	return (
		<TableContainer component={Paper}>
			<ExportButton id={`capital-${formatOneDate(reportDate)}`} />
			<Table id={`capital-${formatOneDate(reportDate)}`} size="small" aria-label="a dense table">
				<TableCap rows={3} text={'тыс. сум'} />
			</Table>
		</TableContainer>
	)
}

export default memo(IncomeAnalysisTable)
