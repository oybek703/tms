import React, { Fragment, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { formatNumber } from '../../../utils'
import CreditPortfolio from '../../charts/Dashboard/CreditPortfolioCharts/RiskPart/CreditPortfolio'
import CPBreakdown from '../../charts/Dashboard/CreditPortfolioCharts/RiskPart/CPBreakdown'
import FundingStructure from '../../charts/Dashboard/CreditPortfolioCharts/FundingStructure'
import useTypedSelector from '../../../hooks/useTypedSelector'
import Loader from '../Loader'
import Alert from '../Alert'
import globalStyles from '../../../styles/globalStyles'
import { Typography } from '@mui/material'
import useActions from '../../../hooks/useActions'

const CreditPortfolioTab = () => {
	const { fetchDashboardCreditData } = useActions()
	const { reportDate } = useTypedSelector(state => state.operDays)
	const { error, loading, dashboard } = useTypedSelector(state => state.dashboard)
	const { creditData, loading: creditDataLoading, error: creditDataError } = useTypedSelector(state => state.creditData)
	const { disaggregatedByTime = [], creditPart = [], issuedCredits = [] } = creditData
	const { fundingStructure = [] } = dashboard
	useEffect(() => {
		fetchDashboardCreditData()
	}, [fetchDashboardCreditData, reportDate])
	return (
		<Fragment>
			{loading || creditDataLoading ? (
				<Loader />
			) : error || creditDataError ? (
				<Alert message={error || creditDataError} />
			) : (
				<Grid>
					{/* Выдача кредитов */}
					<Grid container justifyContent="center">
						<Grid sx={globalStyles.oneRowTitle} container justifyContent="center" component={Paper}>
							Выдача кредитов
						</Grid>
						<Grid sx={globalStyles.smallCardGrid} container>
							{['UZS', 'USD', 'EUR'].map((v, i) => (
								<Grid key={i} sx={globalStyles.smallCardPadding} item component={Paper}>
									{v} &nbsp;
									<Typography component="span" sx={globalStyles.greens}>
										{formatNumber(issuedCredits[i])} {i === 0 ? 'млрд.' : 'млн.'}{' '}
									</Typography>
								</Grid>
							))}
						</Grid>
					</Grid>
					{/* Выдача кредитов COLS */}
					<Grid sx={globalStyles.oneRowTitle} container justifyContent="center" component={Paper}>
						<span>Качество кредитного портфеля</span>
					</Grid>
					{/* Качество кредитного портфеля CHARTS */}
					<br />
					<Grid spacing={2} container justifyContent="space-between">
						<Grid item sm={6} md={4}>
							<CreditPortfolio series={creditPart.slice(1)} />
						</Grid>
						<Grid item sm={6} md={4}>
							<CPBreakdown series={disaggregatedByTime} />
						</Grid>
						<Grid item sm={6} md={4}>
							<FundingStructure series={fundingStructure} />
						</Grid>
					</Grid>
					{/* Качество кредитного портфеля NUMBERS */}
					<Grid sx={globalStyles.smallCardGrid} container>
						{['КП', 'NPL', 'ПР'].map((v, i) => (
							<Grid key={i} sx={globalStyles.smallCardPadding} item component={Paper}>
								<span>{v} &nbsp;</span>
								<Typography component="span" sx={globalStyles.greens}>
									{formatNumber(+creditPart[i])} млн.
								</Typography>
							</Grid>
						))}
					</Grid>
				</Grid>
			)}
		</Fragment>
	)
}

export default CreditPortfolioTab
