import React, { Fragment } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { v4 as uuid } from 'uuid'
import CurrencyRateLine from './CurrencyRateLine'
import { DashboardCurrencyRates, ExternalCurrencyRates } from './CurrencyRateTables'
import globalStyles from '../../../../../styles/global-styles'

interface CurrencyRatesTabProps {
	currencyRates: any
}

const CurrencyRatesTab: React.FC<CurrencyRatesTabProps> = ({ currencyRates = {} }) => {
	const { cbRate = [], legalEntitiesRates = [], individualsRates = [], last90Rates = {} } = currencyRates
	return (
		<Fragment>
			<Grid container justifyContent="center" component={Paper} sx={globalStyles.oneRowTitle}>
				Курсы валют
			</Grid>
			{/* CURRENCY RATES*/}
			<Grid sx={globalStyles.smallCardGrid} container justifyContent="space-between">
				{['Курсы ЦБ', 'Курсы для юр. лиц', 'Курсы для физ. лиц'].map(title => (
					<Grid sx={globalStyles.oneRowTitle} component={Paper} item key={uuid()} xs={12}>
						{title}
					</Grid>
				))}
			</Grid>
			<Grid container justifyContent="space-between" sx={globalStyles.smallCardGrid}>
				<DashboardCurrencyRates cbRate={cbRate} />
				<ExternalCurrencyRates rates={legalEntitiesRates} />
				<ExternalCurrencyRates rates={individualsRates} />
			</Grid>
			<CurrencyRateLine last90Rates={last90Rates} />
		</Fragment>
	)
}

export default CurrencyRatesTab
