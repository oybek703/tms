import React from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import { Typography } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import FormattedCell from '../../helpers/formattedCell/FormattedCell'
import { formatNumber } from '../../../utils'

interface ValuteProps {
	number: number
	differ: number
	image: string
}

const Valute: React.FC<ValuteProps> = ({ number = 0, differ = 0, image = 'uzs' }) => {
	return (
		<Grid item component={Card}>
			<Grid container justifyContent="space-around" alignItems="center">
				<Grid item xs={8}>
					<CardContent sx={{ padding: '5px 10px' }}>
						<Typography sx={{ fontSize: '1.8rem', marginLeft: '10px' }} component="h2" color="inherit">
							{formatNumber(+number)} {image === 'uzs' ? 'млрд' : 'млн'}
						</Typography>
					</CardContent>
					<CardActions>
						<FormattedCell
							alignText="flex-start"
							number={differ}
							textVar="h6"
							iconSize="large"
							curr={image === 'uzs' ? 'млрд' : 'млн'}
						/>
					</CardActions>
				</Grid>
				<Grid item xs={4} container justifyContent="space-evenly">
					<Typography component="h1" sx={{ color: '#666', fontSize: '2.5rem', fontWeight: 'bold' }}>
						{image.toUpperCase()}
					</Typography>
				</Grid>
			</Grid>
		</Grid>
	)
}

export default Valute
