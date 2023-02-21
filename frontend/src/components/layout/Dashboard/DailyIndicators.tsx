import React, { Fragment } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Valute from './Valute'
import LiquidityCard from './LiquidityCard'
import { v4 as uuid } from 'uuid'
import FakeSuspense from '../../helpers/FakeSuspense'
import LiquidityPoints from '../../charts/dashboard/dailyIndicators/LiquidityPoints'
import Position from './DashboardCurrencyRates/Position'
import CurrencyPositionChart from '../../charts/dashboard/dailyIndicators/CurrencyPositionChart'
import { getDashboardLiquidityIndicator, mergeStyles } from '../../../utils'
import globalStyles from '../../../styles/globalStyles'
import { ISxStyles } from '../../../interfaces/styles.interface'
import { DASHBOARD_IL, DASHBOARD_LCR, DASHBOARD_NSFR, DASHBOARD_VLA, IL_ID } from '../../../constants'
import theme from '../../theme'

const styles: ISxStyles = {
	liqRate: {
		display: 'grid',
		gridTemplateColumns: 'repeat(4, 1fr)',
		gap: '10px',
		margin: '10px auto',
		[theme.breakpoints.down('lg')]: {
			gridTemplateColumns: 'repeat(2, 1fr)'
		},
		[theme.breakpoints.down('md')]: {
			gridTemplateColumns: '1fr'
		}
	}
}

interface DailyIndicatorsProps {
	dashboardCorrespondent: any
	dashboardCurrencyPosition: any
	vla: any
	lcr: any
	nsfr: any
	il: any
}

const DailyIndicators: React.FC<DailyIndicatorsProps> = ({
	dashboardCorrespondent = [],
	dashboardCurrencyPosition = {},
	vla = {},
	lcr = {},
	nsfr = {},
	il = {}
}) => {
	const [lcrLastPointers, nsfrLastPointers, ilLastPointers] = [lcr, nsfr, il].map(getDashboardLiquidityIndicator)
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
			<Grid sx={styles.liqRate} container>
				{[
					{ label: DASHBOARD_VLA, data: vlaCurrent },
					{ label: DASHBOARD_LCR, data: lcrLastPointers },
					{ label: DASHBOARD_NSFR, data: nsfrLastPointers },
					{ label: DASHBOARD_IL, data: ilLastPointers }
				].map(({ data, label }) => (
					<LiquidityCard totalOnly={label === DASHBOARD_IL} key={uuid()} data={data} label={label} />
				))}
			</Grid>
			<FakeSuspense>
				<Grid container sx={styles.liqRate}>
					<Grid item component={Paper}>
						<LiquidityPoints data={vla} id="vla" normative={10} />
					</Grid>
					<Grid item component={Paper}>
						<LiquidityPoints data={lcr} id="lcr" />
					</Grid>
					<Grid item component={Paper}>
						<LiquidityPoints data={nsfr} id="nsfr" />
					</Grid>
					<Grid item component={Paper}>
						<LiquidityPoints normative={25} data={il} id={IL_ID} />
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
				<Grid item xs={12} sm={12} md={12} lg={4}>
					<Position position={position} />
				</Grid>
				<Grid item xs={12} sm={12} md={12} lg={8}>
					<CurrencyPositionChart series={currencyPosition} />
				</Grid>
			</Grid>
		</Fragment>
	)
}

export default DailyIndicators
