import React, { memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { formatNumber, formatOneDate } from '../../utils'
import ExportButton from '../layout/ExportButton'
import BoldWithColor from '../helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'
import globalStyles from '../../styles/globalStyles'

function DepositsByDeadlineTable({ rows = [] }) {
	const { reportDate } = useTypedSelector(state => state.operDays)
	return (
		<TableContainer component={Paper}>
			<ExportButton id={`deposits-by-deadline-${formatOneDate(reportDate)}`} />
			<Table id={`deposits-by-deadline-${formatOneDate(reportDate)}`} size="medium" aria-label="a dense table">
				<TableHead sx={globalStyles.stickyTableHead}>
					<TableRow>
						<TableCell rowSpan={2}>
							<BoldWithColor>Срок погашения(в днях)</BoldWithColor>
						</TableCell>
						<TableCell align="center" colSpan={2}>
							<BoldWithColor>Срочные депозити</BoldWithColor>
						</TableCell>
						<TableCell align="center" colSpan={2}>
							<BoldWithColor>Депозитные сертификаты</BoldWithColor>
						</TableCell>
						<TableCell align="center" colSpan={2}>
							<BoldWithColor>Сберегателные депозити</BoldWithColor>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell align="center">
							<BoldWithColor>Сумма</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>в том числе в иностранной валюте (в екв. в сумах)</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>Сумма</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>в том числе в иностранной валюте (в екв. в сумах)</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>Сумма</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>в том числе в иностранной валюте (в екв. в сумах)</BoldWithColor>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row: any, index: number) => (
						<TableRow hover key={index}>
							<TableCell>{<b>{row['indicatorName']}</b>}</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{formatNumber(row['tdNat'], 'e')}
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{formatNumber(row['tdFor'], 'e')}
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{formatNumber(row['dcNat'], 'e')}
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{formatNumber(row['dcFor'], 'e')}
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{formatNumber(row['sdNat'], 'e')}
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{formatNumber(row['sdFor'], 'e')}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default memo(DepositsByDeadlineTable)
