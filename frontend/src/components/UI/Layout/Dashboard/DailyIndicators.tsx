import React, { Fragment } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Valute from './Valute'
import LiquidityCard from './LiquidityCard'
import { v4 as uuid } from 'uuid'
import FakeSuspense from '../../helpers/FakeSuspense'
import LiquidityPoints from '../../../charts/Dashboard/DailyIndicators/LiquidityPoints'
import Position from './DashboardCurrencyRates/Position'
import CurrencyPositionChart from '../../../charts/Dashboard/DailyIndicators/CurrencyPositionChart'
import makeStyles from '@mui/styles/makeStyles'
import { getDashboardLiquidityIndicator } from '../../../../utils'

const useStyles = makeStyles(theme => ({
	liqRate: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		margin: '20px auto'
	},
	smallCardContainer: theme.mixins.smallCardContainer,
	smallCard: theme.mixins.smallCard,
	horizontalTitle: theme.mixins.oneRowTitle,

	noWrap: theme.mixins.noWrap,
	marginBottom10: theme.mixins.marginBottom10
}))

interface DailyIndicatorsProps {
	dashboardCorrespondent: any
	dashboardCurrencyPosition: any
	vla: any
	lcr: any
	nsfr: any
}

const DailyIndicators: React.FC<DailyIndicatorsProps> = ({
	dashboardCorrespondent = [],
	dashboardCurrencyPosition = {},
	vla = {},
	lcr = {},
	nsfr = {}
}) => {
	const classes = useStyles()
	const [lcrLastPointers, nsfrLastPointers] = [lcr, nsfr].map(getDashboardLiquidityIndicator)
	const { vlaCurrent } = vla
	const { currencyPosition = [], position = [] } = dashboardCurrencyPosition
	return (
		<Fragment>
			{/* CURRENCY(CORRESPONDENT) RATE*/}
			<Grid container justifyContent="center" component={Paper} className={classes.horizontalTitle}>
				Остатки корреспондентских счетов
			</Grid>
			{/* LIQUIDITY RATE*/}
			<Grid container justifyContent="space-between" className={classes.liqRate}>
				{dashboardCorrespondent.map(({ value, differ, image }: { value: number; differ: number; image: string }) => (
					<Valute key={image} number={value} differ={differ} image={image} />
				))}
			</Grid>
			<Grid container justifyContent="center" component={Paper} className={classes.horizontalTitle}>
				Показатели ликвидности
			</Grid>
			{/* VLA LCR NSFR*/}
			<Grid className={classes.smallCardContainer} container>
				{[
					{ label: 'ЮЛА (HQLA)', data: vlaCurrent },
					{ label: 'ЛКМК (LCR)', data: lcrLastPointers },
					{ label: 'СБМК (NSFR)', data: nsfrLastPointers }
				].map(({ data, label }) => (
					<LiquidityCard key={uuid()} data={data} label={label} />
				))}
			</Grid>
			<FakeSuspense>
				<Grid container justifyContent="space-between" className={classes.smallCardContainer}>
					<Grid item xs={12} sm={6} className={classes.smallCard} md={4} component={Paper}>
						<LiquidityPoints data={vla} id="vla" normative={10} />
					</Grid>
					<Grid item xs={12} sm={6} className={classes.smallCard} md={4} component={Paper}>
						<LiquidityPoints data={lcr} id="lcr" />
					</Grid>
					<Grid item xs={12} sm={6} className={classes.smallCard} md={4} component={Paper}>
						<LiquidityPoints data={nsfr} id="nsfr" />
					</Grid>
				</Grid>
			</FakeSuspense>
			<Grid
				container
				justifyContent="center"
				component={Paper}
				className={[classes.horizontalTitle, classes.marginBottom10].join(' ')}
			>
				Валютные позиции
			</Grid>
			<Grid container justifyContent="space-between" spacing={1}>
				<Grid item xs={12} sm={6} md={4}>
					<Position position={position} />
				</Grid>
				<Grid item xs={12} sm={6} md={8}>
					<CurrencyPositionChart series={currencyPosition} />
				</Grid>
			</Grid>
		</Fragment>
	)
}

export default DailyIndicators
