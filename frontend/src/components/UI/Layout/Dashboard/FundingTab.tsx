import React, { Fragment } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { formatNumber } from '../../../../utils'
import CurrencyMFI from '../../../charts/Dashboard/FundingCharts/CurrencyMFI'
import CurrencyMBD from '../../../charts/Dashboard/FundingCharts/CurrencyMBD'
import CurrencyTimeDeposits from '../../../charts/Dashboard/FundingCharts/CurrencyTimeDeposits'
import TimeDepositsChart from '../../../charts/Dashboard/FundingCharts/TimeDepositsChart'
import InterbankDepositsChart from '../../../charts/Dashboard/FundingCharts/InterbankDepositsChart'
import globalStyles from '../../../../styles/global-styles'
import { Typography } from '@mui/material'

interface FundingTabProps {
	currencyMfi: any
	currencyMBD: any
	currencyTimeDeposits: any
	timeDeposits: any
	interbankDeposits: any
}

const FundingTab: React.FC<FundingTabProps> = ({
	currencyMfi = {},
	currencyMBD = {},
	currencyTimeDeposits = {},
	timeDeposits = {},
	interbankDeposits = {}
}) => {
	const mfiSum = Number(currencyMfi.reduce((a: any, b: any) => +a + +b, 0)).toFixed(2)
	const mbdSum = Number(currencyMBD.reduce((a: any, b: any) => +a + +b, 0)).toFixed(2)
	const currencyTimeDepositsSum = Number(currencyTimeDeposits.reduce((a: any, b: any) => +a + +b, 0)).toFixed(2)
	return (
		<>
			<Fragment>
				{/* CREDIT DEPOSITS */}
				<Grid sx={globalStyles.smallCardGrid} container justifyContent="space-between">
					<Grid sx={globalStyles.smallCardPadding} item component={Paper}>
						МФИ &nbsp;{' '}
						<Typography component="span" sx={globalStyles.greens}>
							{formatNumber(+mfiSum)} млрд.
						</Typography>
					</Grid>
					<Grid sx={globalStyles.smallCardPadding} item component={Paper}>
						МБД &nbsp;{' '}
						<Typography component="span" sx={globalStyles.greens}>
							{formatNumber(+mbdSum)} млрд.
						</Typography>
					</Grid>
					<Grid sx={globalStyles.smallCardPadding} item component={Paper}>
						Срочные депозиты &nbsp;
						<Typography component="span" sx={globalStyles.greens}>
							{formatNumber(+currencyTimeDepositsSum)} млрд.
						</Typography>
					</Grid>
				</Grid>
				{/* CREDIT SECOND BAR ROWS */}
				<Grid spacing={2} sx={{ marginBottom: 2 }} container justifyContent="space-between">
					<Grid item sm={6} md={4}>
						<CurrencyMFI series={currencyMfi} />
					</Grid>
					<Grid item sm={6} md={4}>
						<CurrencyMBD series={currencyMBD} />
					</Grid>
					<Grid item sm={6} md={4}>
						<CurrencyTimeDeposits series={currencyTimeDeposits} />
					</Grid>
				</Grid>
				{/* DEPOSITS GRAPHS*/}
				<Grid spacing={2} container justifyContent="space-between">
					<Grid item sm={6}>
						<TimeDepositsChart series={timeDeposits} />
					</Grid>
					<Grid item sm={6}>
						<InterbankDepositsChart series={interbankDeposits} />
					</Grid>
				</Grid>
			</Fragment>
		</>
	)
}

export default FundingTab
