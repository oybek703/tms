import React, { memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { formatNumber, formatOneDate } from '../../utils'
import TableCap from '../helpers/TableCap'
import FormattedCell from '../helpers/formattedCell/FormattedCell'
import ExportButton from '../layout/ExportButton'
import BoldWithColor from '../helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'
import globalStyles from '../../styles/globalStyles'

const RenderedCorrespondentTable = function ({
	currentState = false,
	currencyRate = [],
	totalCash = [],
	interbankDeposits = []
}) {
	const { reportDate } = useTypedSelector(indicatorName => indicatorName.operDays)
	return (
		<TableContainer component={Paper}>
			<ExportButton id={`correspondent-${currentState ? 'realtime' : formatOneDate(reportDate)}`} />
			<Table
				tableexport-key={`correspondent-${currentState ? 'realtime' : formatOneDate(reportDate)}`}
				id={`correspondent-${currentState ? 'realtime' : formatOneDate(reportDate)}`}
				size="small"
				aria-label="a dense table"
			>
				<TableCap rows={11} text={'млн. сум'} />
				<TableHead sx={globalStyles.stickyTableHead}>
					<TableRow>
						<TableCell align="center">
							<BoldWithColor>№</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>Наименование</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>UZS</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>CNY</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>JPY</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>KZT</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>RUB</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>CHF</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>GBP</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>USD</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>EUR</BoldWithColor>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{currencyRate.map((row: any, i: number) => (
						<TableRow hover key={`${row.indicatorName}+${i}`}>
							<TableCell align="center">{row['isTableHead'] ? <b>{row.count}</b> : row.count}</TableCell>
							<TableCell align="left">{row['isTableHead'] ? <b>{row.indicatorName}</b> : row.indicatorName}</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{row['isTableHead'] ? <b>{formatNumber(row.uzs, 'e')}</b> : formatNumber(row.uzs, 'e')}
							</TableCell>
							{i !== 1 ? (
								<>
									<TableCell sx={globalStyles.noWrap} align="center">
										<b>{formatNumber(row.cny)}</b>
									</TableCell>
									<TableCell sx={globalStyles.noWrap} align="center">
										<b>{formatNumber(row.jpy)}</b>
									</TableCell>
									<TableCell sx={globalStyles.noWrap} align="center">
										<b>{formatNumber(row.kzt)}</b>
									</TableCell>
									<TableCell sx={globalStyles.noWrap} align="center">
										<b>{formatNumber(row.rub)}</b>
									</TableCell>
									<TableCell sx={globalStyles.noWrap} align="center">
										<b>{formatNumber(row.chf)}</b>
									</TableCell>
									<TableCell sx={globalStyles.noWrap} align="center">
										<b>{formatNumber(row.gbp)}</b>
									</TableCell>
									<TableCell sx={globalStyles.noWrap} align="center">
										<b>{formatNumber(row.usd)}</b>
									</TableCell>
									<TableCell sx={globalStyles.noWrap} align="center">
										<b>{formatNumber(row.eur)}</b>
									</TableCell>
								</>
							) : (
								<>
									<TableCell align="center">
										<FormattedCell number={row.cny} />
									</TableCell>
									<TableCell align="center">
										<FormattedCell number={row.jpy} />
									</TableCell>
									<TableCell align="center">
										<FormattedCell number={row.kzt} />
									</TableCell>
									<TableCell align="center">
										<FormattedCell number={row.rub} />
									</TableCell>
									<TableCell align="center">
										<FormattedCell number={row.chf} />
									</TableCell>
									<TableCell align="center">
										<FormattedCell number={row.gbp} />
									</TableCell>
									<TableCell align="center">
										<FormattedCell number={row.usd} />
									</TableCell>
									<TableCell align="center">
										<FormattedCell number={row.eur} />
									</TableCell>
								</>
							)}
						</TableRow>
					))}
					{[totalCash, interbankDeposits].map((arr: any) =>
						arr.map((row: any, i: number) => (
							<TableRow hover key={`${row.indicatorName}+${i}`}>
								<TableCell align="center">{row['isTableHead'] ? <b>{row.count}</b> : row.count}</TableCell>
								<TableCell align="left">
									{row['isTableHead'] ? <b>{row.indicatorName}</b> : row.indicatorName}
								</TableCell>
								<TableCell sx={globalStyles.noWrap} align="center">
									{row['isTableHead'] ? <b>{formatNumber(row.uzs, true)}</b> : formatNumber(row.uzs, true)}
								</TableCell>
								<TableCell sx={globalStyles.noWrap} align="center">
									{row['isTableHead'] ? <b>{formatNumber(row.cny, true)}</b> : formatNumber(row.cny, true)}
								</TableCell>
								<TableCell sx={globalStyles.noWrap} align="center">
									{row['isTableHead'] ? <b>{formatNumber(row.jpy, true)}</b> : formatNumber(row.jpy, true)}
								</TableCell>
								<TableCell sx={globalStyles.noWrap} align="center">
									{row['isTableHead'] ? <b>{formatNumber(row.kzt, true)}</b> : formatNumber(row.kzt, true)}
								</TableCell>
								<TableCell sx={globalStyles.noWrap} align="center">
									{row['isTableHead'] ? <b>{formatNumber(row.rub, true)}</b> : formatNumber(row.rub, true)}
								</TableCell>
								<TableCell sx={globalStyles.noWrap} align="center">
									{row['isTableHead'] ? <b>{formatNumber(row.chf, true)}</b> : formatNumber(row.chf, true)}
								</TableCell>
								<TableCell sx={globalStyles.noWrap} align="center">
									{row['isTableHead'] ? <b>{formatNumber(row.gbp, true)}</b> : formatNumber(row.gbp, true)}
								</TableCell>
								<TableCell sx={globalStyles.noWrap} align="center">
									{row['isTableHead'] ? <b>{formatNumber(row.usd, true)}</b> : formatNumber(row.usd, true)}
								</TableCell>
								<TableCell sx={globalStyles.noWrap} align="center">
									{row['isTableHead'] ? <b>{formatNumber(row.eur, true)}</b> : formatNumber(row.eur, true)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

interface CorrespondentTableProps {
	rows: any
	currentState: boolean
}

const CorrespondentTable: React.FC<CorrespondentTableProps> = function ({ rows, currentState = false }) {
	const { currencyRate = [], totalCash = [], interbankDeposits = [] } = rows
	return (
		<RenderedCorrespondentTable
			currencyRate={currencyRate}
			currentState={currentState}
			interbankDeposits={interbankDeposits}
			totalCash={totalCash}
		/>
	)
}

export default memo(CorrespondentTable)
