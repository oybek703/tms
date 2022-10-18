import React from 'react'
import { Link, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Spaces from '../../helpers/FormattedCell/Spaces'

const styles = {
	root: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		boxSizing: 'border-box',
		color: '#424040',
		borderRadius: 0,
		padding: '10px 40px',
		marginTop: '10px',
		borderLeft: 0,
		borderRight: 0
	},
	link: {
		cursor: 'pointer',
		textDecoration: 'none',
		'&:hover': {
			textDecoration: 'none'
		}
	}
}

const Footer = () => {
	return (
		<Paper variant="outlined" component="footer" elevation={0} sx={styles.root}>
			<Grid item>
				<Typography variant="body1" sx={styles.link} href="#" align="center" component={Link}>
					Support <Spaces count={5} />
				</Typography>
				<Typography variant="body1" sx={styles.link} href="#" align="center" component={Link}>
					Help
				</Typography>
			</Grid>
			<Grid item>
				<Typography variant="body1" align="center">
					{' '}
					Asakabank - © 2022
				</Typography>
			</Grid>
		</Paper>
	)
}

export default Footer
