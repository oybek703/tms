import React from 'react'
import Grid from '@mui/material/Grid'
import { v4 as uuid } from 'uuid'
import Card from '@mui/material/Card'
import { Typography } from '@mui/material'
import { formatNumber } from '../../../../utils'
import RWAPoints from '../../../charts/Dashboard/Capital/RWAPoints'
import CapitalPoints from '../../../charts/Dashboard/Capital/CapitalPoints'

const styles = {
	greens: {
		color: '#00B050',
		fontSize: '12pt'
	},
	capitalText: {
		padding: '10px',
		fontSize: '1.2em',
		fontWeight: 600,
		color: '#555'
	},
	capitalNumber: {
		fontSize: '1.05em'
	}
}

interface CapitalTabProps {
	vla: any
}

const CapitalTab: React.FC<CapitalTabProps> = ({ vla = { categories: [] } }) => {
	const capitalPoints: any = {
		rc: 6183.7,
		car: 14.24,
		rwa: 43432.64,
		forecast: 14.05
	}
	const forecastCategories = Object.assign([], vla.categories)
	const now = new Date()
	const current = new Date(now.getFullYear(), now.getMonth() + 1, 1)
	const nextMonth = new Date(current).toLocaleDateString('ru', { month: 'long' })
	// @ts-ignore
	const nextMonthSliced = [...nextMonth]
		.map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
		.slice(0, 3)
		.join('')
	forecastCategories.shift()
	forecastCategories.push(nextMonthSliced)
	return (
		<>
			<Grid container sx={{ marginBottom: 2 }} justifyContent="space-between" alignItems="center" spacing={2}>
				{[
					{ title: 'Регулятивний капитал', shortKey: 'rc' },
					{
						title: 'Коэффициент адекватности капитала',
						shortKey: 'car'
					}
				].map(({ title, shortKey }, i) => (
					<Grid key={uuid()} item sm={6}>
						<Card>
							<Typography sx={{ ...styles.greens, ...styles.capitalText }} align="center">
								{title}
								&nbsp;
								<Typography component="span" sx={{ ...styles.greens, ...styles.capitalNumber }}>
									{formatNumber(capitalPoints[shortKey])} {i === 1 && '%'}
								</Typography>
							</Typography>
						</Card>
					</Grid>
				))}
			</Grid>
			<Grid spacing={2} sx={{ marginBottom: 2 }} container justifyContent="space-between">
				<Grid item sm={6}>
					<RWAPoints
						data={{
							...vla,
							series: [5940.72, 5944.44, 5902.41, 6221.8, 6177.2, 6183.7]
						}}
						id="rc"
					/>
				</Grid>
				<Grid item sm={6}>
					<CapitalPoints
						data={{
							...vla,
							series: [14.23, 13.51, 13.1, 13.83, 13.68, 14.24]
						}}
						id="car"
						label="Коеф. адек. капитала"
						normative={13}
					/>
				</Grid>
			</Grid>
			<Grid container sx={{ marginBottom: 2 }} justifyContent="space-between" alignItems="center" spacing={2}>
				{[
					{
						title: 'Активы взвешенные с учетом риска',
						shortKey: 'rwa'
					},
					{
						title: 'Прогноз коэффициента адекватности капитала',
						shortKey: 'forecast'
					}
				].map(({ title, shortKey }, i) => (
					<Grid key={uuid()} item sm={6}>
						<Card>
							<Typography sx={{ ...styles.greens, ...styles.capitalText }} align="center">
								{title}
								&nbsp;
								<Typography component="span" sx={{ ...styles.greens, ...styles.capitalNumber }}>
									{formatNumber(capitalPoints[shortKey])} {i === 1 && '%'}
								</Typography>
							</Typography>
						</Card>
					</Grid>
				))}
			</Grid>
			<Grid spacing={2} container justifyContent="space-between">
				<Grid item sm={6}>
					<RWAPoints
						data={{
							...vla,
							series: [41753.69, 44008.56, 45056.56, 44976.2, 45162.35, 43432.64]
						}}
						id="rwa"
					/>
				</Grid>
				<Grid item sm={6}>
					<CapitalPoints
						data={{
							...vla,
							categories: forecastCategories,
							series: [14.3, 13.8, 13.9, 13.95, 14.1, 14.05]
						}}
						id="forecast"
						label="Прогноз"
						normative={13}
					/>
				</Grid>
			</Grid>
		</>
	)
}

export default CapitalTab
