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
import CorporateRetail from '../charts/competitiveAnalysis/CorporateRetail'
import { ISxStyles } from '../../interfaces/styles.interface'
import ByCurrency from '../charts/competitiveAnalysis/ByCurrency'

const pageStyles: ISxStyles = {
	main: {
		display: 'grid',
		gridTemplateRows: 'minmax(100px, auto) 1fr',
		gridTemplateColumns: '2fr 1fr 1fr',
		gap: '10px',
		mb: 7
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

interface IndicatorNameCellProps {
	indicatorName: string
	tabbed?: boolean
}

const IndicatorNameCell: React.FC<IndicatorNameCellProps> = ({ tabbed, indicatorName }) => {
	return (
		<TableCell>
			{tabbed && <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>}
			{indicatorName}
		</TableCell>
	)
}

const CompetitiveAnalysisTable = function () {
	const {
		competitiveAnalysis: { quarterDates, nbu, psb, main }
	} = useTypedSelector(state => state.competitiveAnalysis)
	const { reportDate } = useTypedSelector(state => state.operDays)
	const banks = [
		{ bankName: 'Асакабанк', data: main },
		{ bankName: 'НБУ', data: nbu },
		{ bankName: 'ПСБ', data: psb }
	]
	return (
		<>
			{banks.map(({ bankName, data }) => (
				<Grid key={uuid()} sx={pageStyles.main}>
					<Grid sx={pageStyles.table}>
						<TableContainer sx={{ maxHeight: '100%', pb: 0 }} component={Paper}>
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
													{bankName} (Кварталний)
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
									{Object.keys(data.totalData).map((value, index, array) => {
										const { firstDate, secondDate, fourthDate, thirdDate, indicatorName, tabbed } =
											data.totalData[value]
										const percent = index > array.length - 3 ? ' %' : ''
										return (
											<TableRow key={uuid()}>
												<IndicatorNameCell indicatorName={indicatorName} tabbed={tabbed} />
												<TableCell sx={globalStyles.noWrap} align="center">
													{formatNumber(firstDate, 'e')}
													{percent}
												</TableCell>
												<TableCell sx={globalStyles.noWrap} align="center">
													{formatNumber(secondDate, 'e')}
													{percent}
												</TableCell>
												<TableCell sx={globalStyles.noWrap} align="center">
													{formatNumber(thirdDate, 'e')}
													{percent}
												</TableCell>
												<TableCell sx={globalStyles.noWrap} align="center">
													{formatNumber(fourthDate, 'e')}
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
						<CorporateRetail
							series={data.chartData['creditPortfolioGrow']}
							categories={quarterDates}
							title={'Рост кредитного портфеля'}
							id={`${bankName.toLowerCase()}_credit_portfolio`}
						/>
					</Grid>
					<Grid sx={pageStyles.chart2}>
						<ByCurrency
							series={data.chartData['actives']}
							categories={quarterDates}
							title={'Рост активов'}
							id={`${bankName.toLowerCase()}_active_grow`}
						/>
					</Grid>
					<Grid sx={pageStyles.chart3}>
						<CorporateRetail
							series={data.chartData['depositGrow']}
							categories={quarterDates}
							title={'Рост депозитов'}
							id={`${bankName.toLowerCase()}_deposit_grow`}
						/>
					</Grid>
					<Grid sx={pageStyles.chart4}>
						<ByCurrency
							series={data.chartData['liabilities']}
							categories={quarterDates}
							title={'Рост обязательств'}
							id={`${bankName.toLowerCase()}_liabilities_grow`}
						/>
					</Grid>
				</Grid>
			))}
		</>
	)
}

export default memo(CompetitiveAnalysisTable)
