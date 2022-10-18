import React from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { formatNumber } from '../../../../../utils'
import StopIcon from '@mui/icons-material/Stop'
import globalStyles from '../../../../../styles/globalStyles'

interface PercentIndicatorProps {
	number: number
	alignText?: string
	total?: boolean
}

const PercentIndicator: React.FC<PercentIndicatorProps> = ({ number, alignText = 'center', total = false }) => {
	return (
		<Grid sx={globalStyles.noWrap} container component="span" alignItems="center" justifyContent={alignText}>
			{total ? (
				number >= -7.99 && number <= 7.99 ? (
					<StopIcon sx={globalStyles.grow} />
				) : (number >= 8 && number <= 10.99) || (number >= -10.99 && number <= -8) ? (
					<StopIcon sx={{ color: '#ecd100' }} />
				) : (
					(number >= 11 || number <= -11) && <StopIcon color="error" />
				)
			) : number >= -4.99 && number <= 4.99 ? (
				<StopIcon sx={globalStyles.grow} />
			) : (number > 5 && number <= 6.99) || (number >= -6.99 && number <= -5) ? (
				<StopIcon sx={{ color: '#ecd100' }} />
			) : (
				(number > 7 || number < -7) && <StopIcon color="error" />
			)}
			{
				<Typography variant="caption" sx={{ color: '#000' }}>
					<b>{formatNumber(number)}%</b>
				</Typography>
			}
		</Grid>
	)
}

export default PercentIndicator
