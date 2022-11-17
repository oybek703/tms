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
import { Grid, TableBody, Typography } from '@mui/material'
import { v4 as uuid } from 'uuid'
import { ICompetitiveAnalysis } from '../../interfaces/ca.interface'
import CAChart from '../charts/competitiveAnalysis/ca-chart'
import { ISxStyles } from '../../interfaces/styles.interface'

const pageStyles: ISxStyles = {
	main: {
		display: 'grid',
		gridTemplateRows: 'minmax(100px, auto) 1fr',
		gridTemplateColumns: '2fr 1fr 1fr',
		gap: '10px'
	},
	table: {
		gridRow: '1/3',
		alignSelf: 'start'
	},
	chart1: {
		alignSelf: 'start'
	},
	chart2: {
		alignSelf: 'stretch'
	},
	chart3: {
		alignSelf: 'end'
	},
	chart4: {
		alignSelf: 'end'
	}
}

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
		<Grid sx={pageStyles.main}>
			<Grid sx={pageStyles.table}>
				<TableContainer sx={{ maxHeight: '100vh', pb: 0 }} component={Paper}>
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
							{Object.keys(totalData).map((value, index, array) => {
								const { firstDate, secondDate, fourthDate, thirdDate, indicatorName, redBold, tabbed } =
									totalData[value]
								const percent = index > array.length - 7 ? ' %' : ''
								return (
									<TableRow key={uuid()}>
										<IndicatorNameCell indicatorName={indicatorName} tabbed={tabbed} redBold={redBold} />
										<TableCell sx={globalStyles.noWrap} align="center">
											{formatNumber(firstDate)}
											{percent}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{formatNumber(secondDate)}
											{percent}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{formatNumber(thirdDate)}
											{percent}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{formatNumber(fourthDate)}
											{percent}
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
			<Grid sx={pageStyles.chart1}>
				<CAChart series={[]} categories={[]} title={'Рост кредитного портфеля'} id={'ca_credit_portfolio'} />
			</Grid>
			<Grid sx={pageStyles.chart2}>
				<CAChart series={[]} categories={[]} title={'Рост активов'} id={'ca_active_grow'} />
			</Grid>
			<Grid sx={pageStyles.chart3}>
				<CAChart series={[]} categories={[]} title={'Рост депозитов'} id={'ca_deposit_grow'} />
			</Grid>
			<Grid sx={pageStyles.chart4}>
				<CAChart series={[]} categories={[]} title={'Рост обязательств'} id={'ca_liabilities_grow'} />
			</Grid>
		</Grid>
	)
}

export default memo(CompetitiveAnalysisTable)
