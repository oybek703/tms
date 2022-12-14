import React, { Fragment, memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import Paper from '@mui/material/Paper'
import TableCap from '../helpers/TableCap'
import { formatNumber, formatOneDate, mergeStyles } from '../../utils'
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined'
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined'
import Typography from '@mui/material/Typography'
import ExpenditureDynamics from '../charts/calcFor/ExpenditureDynamics'
import { Grid, TableRow } from '@mui/material'
import CorrespondentDynamics from '../charts/dashboard/forCharts/CorrespondentDynamic'
import Deviation from '../charts/dashboard/forCharts/Deviation'
import Alert from '../layout/Alert'
import ExportButton from '../layout/ExportButton'
import BoldWithColor from '../helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'
import { Variant } from '@mui/material/styles/createTypography'
import Delayed from '../helpers/Delayed'
import globalStyles from '../../styles/globalStyles'

interface FormattedDataProps {
	number: number
	variant?: Variant | 'inherit'
}

const FormattedData: React.FC<FormattedDataProps> = ({ number, variant = 'body2' }) => {
	return (
		<Grid sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			{
				<Typography component="span" variant={variant} sx={number < 0 ? globalStyles.down : globalStyles.grow}>
					{formatNumber(number, 'e')}
				</Typography>
			}
			{number < 0 ? (
				<ArrowDropDownOutlinedIcon color="error" />
			) : number === 0 ? (
				''
			) : (
				<ArrowDropUpOutlinedIcon sx={globalStyles.grow} />
			)}
		</Grid>
	)
}

interface WarningDataInterface {
	rows: any
	role: string
}

const WarningAlert: React.FC<WarningDataInterface> = ({ rows, role }) => {
	if (rows.length) return null
	return (
		<Alert
			type="warning"
			message={`Central Bank Standard is not entered yet. ${
				role === 'admin' ? 'Please, make sure it is    entered.' : 'Report admin user about it.'
			}`}
		/>
	)
}

interface CalcForTableProps {
	forDashboard: boolean
}

const CalcForTable: React.FC<CalcForTableProps> = ({ forDashboard = false }) => {
	const {
		user: { role }
	} = useTypedSelector(state => state.auth)
	const { calcFor = [] } = useTypedSelector(state => state.calcFor)
	const { reportDate } = useTypedSelector(state => state.operDays)
	const forValues = calcFor.filter((r: any) => r['forValue'] !== 0)
	const forSum = calcFor.reduce((acc: any, val: any) => (acc += val['forValue']), 0) / forValues.length
	const consumptionSum = calcFor.reduce((acc: any, val: any) => (acc += val['avgConsumption']), 0)
	const cbStandards = calcFor.filter((r: any) => r['cbStandard'] !== 0)
	const cbStandardAverage =
		cbStandards.reduce((acc: any, val: any) => (acc += val['cbStandard']), 0) / cbStandards.length
	const deviationSum = forSum - cbStandardAverage
	const categories = calcFor.map((r: any) => r['date'])
	const expenditureSeries = calcFor.map((r: any) => r['avgConsumption'])
	const correspondentSeries = calcFor.map((r: any) => r['forValue'])
	const deviationSeries = calcFor.map((r: any) => r['stDeviation'])
	if (forDashboard) {
		return (
			<Fragment>
				<WarningAlert rows={calcFor} role={role} />
				{calcFor.length && (
					<Fragment>
						<CorrespondentDynamics series={correspondentSeries} categories={categories} />
						<br />
						<Deviation series={deviationSeries} categories={categories} />
					</Fragment>
				)}
			</Fragment>
		)
	}
	return (
		<Fragment>
			<Delayed waitBeforeShow={1000}>
				<WarningAlert role={role} rows={calcFor} />
			</Delayed>
			<Fragment>
				<TableContainer component={Paper} sx={mergeStyles(globalStyles.marginBottom10, globalStyles.paddingBottom0)}>
					<Table size="small">
						<TableHead sx={globalStyles.stickyTableHead}>
							<TableRow>
								<TableCell align="center">
									<BoldWithColor>
										<h3>Исполнение норматива, в %</h3>
									</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>
										<h3>Разница (+;-)</h3>
									</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>
										<h3>Средний расход за превышенную сумму</h3>
									</BoldWithColor>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow hover>
								<TableCell align="center">
									<b>
										<FormattedData
											number={Number.isNaN((forSum * 100) / cbStandardAverage) ? 0 : (forSum * 100) / cbStandardAverage}
											variant="h6"
										/>
									</b>
								</TableCell>
								<TableCell align="left">
									<b>
										<FormattedData number={Number.isNaN(deviationSum) ? 0 : deviationSum} variant="h6" />
									</b>
								</TableCell>
								<TableCell align="left">
									<b>
										<FormattedData number={Number.isNaN(consumptionSum) ? 0 : consumptionSum} variant="h6" />
									</b>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
				<ExpenditureDynamics categories={categories} series={expenditureSeries} />
				<TableContainer component={Paper} sx={globalStyles.marginTop10}>
					<ExportButton id={`calc-for-${formatOneDate(reportDate)}`} />
					<Table id={`calc-for-${formatOneDate(reportDate)}`} size="small" aria-label="a dense table">
						<TableCap rows={5} text={'тыс. сум'} />
						<TableHead sx={globalStyles.stickyTableHead}>
							<TableRow>
								<TableCell scope="row" align="center">
									<BoldWithColor>Дата</BoldWithColor>
								</TableCell>
								<TableCell scope="row" align="center">
									<BoldWithColor>Фактический остаток на корсчете</BoldWithColor>
								</TableCell>
								<TableCell scope="row" align="center">
									<BoldWithColor>Норматив ЦБ</BoldWithColor>
								</TableCell>
								<TableCell scope="row" align="center">
									<BoldWithColor>Отклонение от норматива</BoldWithColor>
								</TableCell>
								<TableCell scope="row" align="center">
									<BoldWithColor>Средний расход за превышенную сумму</BoldWithColor>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{calcFor.map((row: any, i: number) => (
								<TableRow hover key={i}>
									<TableCell align="center">{row.date}</TableCell>
									<TableCell align="center">{formatNumber(row.forValue, 'e')}</TableCell>
									<TableCell align="center">{formatNumber(row.cbStandard, 'e')}</TableCell>
									<TableCell align="center">
										<FormattedData number={row.stDeviation} />
									</TableCell>
									<TableCell align="left">
										<FormattedData number={row.avgConsumption} />
									</TableCell>
								</TableRow>
							))}
							<TableRow hover>
								<TableCell scope="row" align="center">
									<b>ИТОГО</b>
								</TableCell>
								<TableCell scope="row" align="center">
									<b>{formatNumber(forSum || 0, 'e')}</b>
								</TableCell>
								<TableCell scope="row" align="center">
									<b>{formatNumber(cbStandardAverage || 0, 'e')}</b>
								</TableCell>
								<TableCell align="center">
									<FormattedData number={deviationSum} />
								</TableCell>
								<TableCell align="center">
									<FormattedData number={consumptionSum} />
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</Fragment>
		</Fragment>
	)
}

export default memo(CalcForTable)
