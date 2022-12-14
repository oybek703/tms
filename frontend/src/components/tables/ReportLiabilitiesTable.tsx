import React, { Fragment, memo, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { formatNumber } from '../../utils'
import { v4 as uuid } from 'uuid'
import PaginatedTable from '../helpers/PaginatedTable'
import BoldWithColor from '../helpers/BoldWithColor'
import globalStyles from '../../styles/globalStyles'
import useTypedSelector from '../../hooks/useTypedSelector'

const columns = ['До 7 дней', ...new Array(12).fill('').map((v, i) => `${i + 1} месяц`), '1-2 года', 'свыше 2 лет']

const ReportLiabilitiesTable = function () {
	const { reportLiabilities } = useTypedSelector(state => state.reportLiabilities)
	const bodyColumns = Object.keys([...reportLiabilities].pop() || {}).filter(
		(v, i) => v !== 'name' && v !== 'currency' && v !== 'accountCode'
	)
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(20)
	return (
		<Fragment>
			<PaginatedTable
				page={page}
				rowsPerPage={rowsPerPage}
				setPage={setPage}
				setRowsPerPage={setRowsPerPage}
				rows={reportLiabilities}
				TableData={
					<TableContainer component={Paper}>
						<Table size="small" aria-label="a dense table">
							<TableHead sx={globalStyles.stickyTableHead}>
								<TableRow>
									<TableCell rowSpan={2}>
										<BoldWithColor>№</BoldWithColor>
									</TableCell>
									<TableCell align="center" sx={globalStyles.noWrap} rowSpan={2}>
										<BoldWithColor>Наименование линии</BoldWithColor>
									</TableCell>
									<TableCell align="center" sx={globalStyles.noWrap} rowSpan={2}>
										<BoldWithColor>Код счета</BoldWithColor>
									</TableCell>
									<TableCell align="center" sx={globalStyles.noWrap} rowSpan={2}>
										<BoldWithColor>Валюта</BoldWithColor>
									</TableCell>
									<TableCell align="center" sx={globalStyles.noWrap} rowSpan={2}>
										<BoldWithColor>Остаток на дату(номинал)</BoldWithColor>
									</TableCell>
									<TableCell align="center" sx={globalStyles.noWrap} rowSpan={2}>
										<BoldWithColor>Остаток на дату(тыс. сум)</BoldWithColor>
									</TableCell>
									{columns.map(c => (
										<TableCell sx={globalStyles.noWrap} colSpan={2} align="center" key={uuid()}>
											<BoldWithColor>{c}</BoldWithColor>
										</TableCell>
									))}
								</TableRow>
								<TableRow>
									{columns.map(_ => (
										<Fragment key={uuid()}>
											<TableCell sx={globalStyles.noWrap} align="center">
												<BoldWithColor>Номинал</BoldWithColor>
											</TableCell>
											<TableCell sx={globalStyles.noWrap} align="center">
												<BoldWithColor>экв. в нац. вал.</BoldWithColor>
											</TableCell>
										</Fragment>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{reportLiabilities
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row: any, i: number) => (
										<TableRow hover key={uuid()}>
											<TableCell>{i + 1}</TableCell>
											<TableCell sx={globalStyles.noWrap}>{row['name']}</TableCell>
											<TableCell sx={globalStyles.noWrap}>{row['accountCode']}</TableCell>
											<TableCell align="center">{row['currency'] === '0' ? '000' : row['currency']}</TableCell>
											{bodyColumns.map(col => (
												<TableCell key={uuid()} sx={globalStyles.noWrap} align="center">
													{formatNumber(row[`${col}`], true)}
												</TableCell>
											))}
										</TableRow>
									))}
							</TableBody>
						</Table>
					</TableContainer>
				}
			/>
		</Fragment>
	)
}

export default memo(ReportLiabilitiesTable)
