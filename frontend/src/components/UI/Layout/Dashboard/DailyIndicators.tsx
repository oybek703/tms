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
import { getDashboardLiquidityIndicator, mergeStyles } from '../../../../utils'
import globalStyles from '../../../../styles/globalStyles'
import { ISxStyles } from '../../../../interfaces/styles.interface'

const styles: ISxStyles = {
	liqRate: {
		display: 'grid',
		gridTemplateColumns: 'repeat(4, 1fr)',
		gap: '10px',
		margin: '10px auto'
	}
}

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
	const [lcrLastPointers, nsfrLastPointers] = [lcr, nsfr].map(getDashboardLiquidityIndicator)
	const { vlaCurrent } = vla
	const { currencyPosition = [], position = [] } = dashboardCurrencyPosition
	return (
		<Fragment>
			{/* CURRENCY(CORRESPONDENT) RATE*/}
			<Grid container justifyContent="center" component={Paper} sx={globalStyles.oneRowTitle}>
				Остатки корреспондентских счетов
			</Grid>
			{/* LIQUIDITY RATE*/}
			<Grid container justifyContent="space-between" sx={styles.liqRate}>
				{dashboardCorrespondent.map(({ value, differ, image }: { value: number; differ: number; image: string }) => (
					<Valute key={image} number={value} differ={differ} image={image} />
				))}
			</Grid>
			<Grid container justifyContent="center" component={Paper} sx={globalStyles.oneRowTitle}>
				Показатели ликвидности
			</Grid>
			{/* VLA LCR NSFR*/}
			<Grid sx={globalStyles.smallCardGrid} container>
				{[
					{ label: 'ЮЛА (HQLA)', data: vlaCurrent },
					{ label: 'ЛКМК (LCR)', data: lcrLastPointers },
					{ label: 'СБМК (NSFR)', data: nsfrLastPointers }
				].map(({ data, label }) => (
					<LiquidityCard key={uuid()} data={data} label={label} />
				))}
			</Grid>
			<FakeSuspense>
				<Grid container sx={globalStyles.smallCardGrid}>
					<Grid item component={Paper}>
						<LiquidityPoints data={vla} id="vla" normative={10} />
					</Grid>
					<Grid item component={Paper}>
						<LiquidityPoints data={lcr} id="lcr" />
					</Grid>
					<Grid item component={Paper}>
						<LiquidityPoints data={nsfr} id="nsfr" />
					</Grid>
				</Grid>
			</FakeSuspense>
			<Grid
				container
				justifyContent="center"
				component={Paper}
				sx={mergeStyles(globalStyles.oneRowTitle, globalStyles.marginBottom10)}
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
