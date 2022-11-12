import React from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import { formatNumber } from '../../../utils'
import { Grid, Typography } from '@mui/material'

function chooseProgressColor(value = 0) {
	if (value >= 0 && value < 50) return '#7b7b7b'
	if (value >= 50 && value < 60) return 'green'
	if (value >= 60 && value < 80) return 'orange'
	if (value >= 80 && value < 100) return '#a44b00'
	if (value >= 100) return 'red'
}

interface ProgressBarProps {
	value: number
	showNumber?: boolean
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value = 0, showNumber = false }) => {
	return (
		<Grid sx={{ height: 15, borderRadius: 0, position: 'relative', backgroundColor: '#ccc', minWidth: 100 }}>
			<LinearProgress
				sx={{
					height: 15,
					borderRadius: 0,
					position: 'relative',
					backgroundColor: '#ccc',
					minWidth: 100,
					'.MuiLinearProgress-bar': {
						borderRadius: 0,
						backgroundColor: chooseProgressColor(value)
					}
				}}
				variant="determinate"
				value={value > 100 ? 100 : +value}
			/>
			<Typography
				component="span"
				sx={{
					position: 'absolute',
					top: -1,
					left: 0,
					bottom: 0,
					right: 0,
					fontSize: '0.8rem',
					textAlign: 'center',
					color: value >= 0 && value < 50 ? '#000' : '#fff'
				}}
				title={String(value)}
			>
				{' '}
				&nbsp; {value > 100 ? (showNumber ? formatNumber(value) : 'больше 100') : `${value}%`}
			</Typography>
		</Grid>
	)
}

export default ProgressBar
