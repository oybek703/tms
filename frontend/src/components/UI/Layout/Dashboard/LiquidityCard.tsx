import React from 'react'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import ListItemText from '@mui/material/ListItemText'
import { formatNumber, formatOneDate, mergeStyles } from '../../../../utils'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import globalStyles from '../../../../styles/globalStyles'
import { Typography } from '@mui/material'
import { ISxStyles } from '../../../../interfaces/styles.interface'

const styles: ISxStyles = {
	totalText: {
		fontSize: '1.5em',
		fontWeight: 550,
		textAlign: 'left',
		padding: 0
	},
	totalSecondaryText: {
		fontSize: '1.5em',
		textAlign: 'left',
		padding: 0
	},
	totalValue: {
		fontWeight: 500,
		fontSize: '1.4em'
	},
	secondaryText: {
		lineHeight: 0,
		color: '#000',
		fontSize: '0.8em',
		fontWeight: 700,
		marginTop: '5px'
	},
	natValue: {
		fontSize: '1.3em',
		fontWeight: 400
	},
	stateCard: {
		position: 'absolute',
		bottom: -6,
		background: '#7794aa',
		fontSize: '0.65em',
		fontWeight: 'bold',
		color: 'white',
		padding: '0.1px'
	}
}

interface LiquidityCardProps {
	data: any
	label: string
}

function StateCard() {
	return (
		<Typography component="span" sx={styles.stateCard}>
			Текущее состояние
		</Typography>
	)
}

const LiquidityCard: React.FC<LiquidityCardProps> = ({ data = [], label = 'ВЛА' }) => {
	const [lastTotal, lastNat, lastForeign] = data
	const { reportDate } = useTypedSelector(state => state.operDays)
	const isToday = formatOneDate(reportDate) === formatOneDate(new Date().toString())
	const splittedLabel = label.split(' ')
	return (
		<Grid
			sx={{ ...globalStyles.smallCardPadding, padding: '0px 2px 5px 0px' }}
			item
			component={Paper}
			variant="outlined"
		>
			<Grid container sx={{ position: 'relative' }} justifyContent="space-between" alignItems="center">
				{isToday && label === 'ЮЛА (HQLA)' && <StateCard />}
				<Grid item xs={6}>
					<Grid container justifyContent="space-around" alignItems="baseline" sx={{ borderRight: '2px dashed #ddd' }}>
						<Grid item sx={{ transform: 'translateY(4px)' }}>
							<Typography component="span" sx={styles.totalText}>
								{splittedLabel[0]}
							</Typography>{' '}
							<Typography component="span" sx={styles.totalSecondaryText}>
								{splittedLabel[1]}
							</Typography>
						</Grid>
						<Grid item>
							{lastTotal && (
								<ListItemText
									primary={
										<Typography component="b" sx={mergeStyles(globalStyles.greens, styles.natValue)}>
											{formatNumber(lastTotal)}%
										</Typography>
									}
									secondaryTypographyProps={{ sx: styles.secondaryText }}
									secondary="итого"
								/>
							)}
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={5}>
					<Grid container spacing={1} justifyContent="space-between" alignItems="center">
						<Grid item xs={6}>
							{lastNat && (
								<ListItemText
									primary={
										<Typography component="b" sx={mergeStyles(globalStyles.greens, styles.natValue)}>
											{formatNumber(lastNat)}%
										</Typography>
									}
									secondaryTypographyProps={{ sx: styles.secondaryText }}
									secondary="нац.валюта"
								/>
							)}
						</Grid>
						<Grid item xs={6}>
							{lastForeign && (
								<ListItemText
									primary={
										<Typography component="b" sx={mergeStyles(globalStyles.greens, styles.natValue)}>
											{formatNumber(lastForeign)}%
										</Typography>
									}
									secondaryTypographyProps={{ sx: styles.secondaryText }}
									secondary="ин.валюта"
								/>
							)}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
}

export default LiquidityCard
