import React, { memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import TableCap from '../helpers/TableCap'
import ExportButton from '../layout/ExportButton'
import globalStyles from '../../styles/globalStyles'
import useTypedSelector from '../../hooks/useTypedSelector'

interface CorrAccountsTableProps {
	rows: any
}

const CorrAccountsAnalyzeTable: React.FC<CorrAccountsTableProps> = ({ rows }) => {
	const { reportDate } = useTypedSelector(state => state.operDays)
	return (
		<TableContainer component={Paper}>
			<ExportButton id={`corr-accounts-${reportDate}`} />
			<Table id={`corr-accounts-${reportDate}`} size="small" aria-label="a dense table">
				<TableCap textAlign="right" rows={7} text={'млрд.сум'} />
				<TableHead sx={globalStyles.stickyTableHead}>
					<TableRow></TableRow>
				</TableHead>
				<TableBody></TableBody>
			</Table>
		</TableContainer>
	)
}

export default memo(CorrAccountsAnalyzeTable)
