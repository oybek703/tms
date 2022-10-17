import React from 'react'
import { Grid, Typography } from '@mui/material'
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard'

const InProcess = () => {
	return (
		<>
			<Grid
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					borderRadius: 10,
					padding: 40
				}}
			>
				<Typography align="center" variant="h3">
					Page is in development process.
				</Typography>
				<Typography align="center" component="i">
					Page will be available as soon as finished development process.
				</Typography>
				<hr />
				<br />
				<Typography align="center">
					<DeveloperBoardIcon fontSize="large" />
				</Typography>
			</Grid>
		</>
	)
}

export default InProcess
