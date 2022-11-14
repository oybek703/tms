import * as React from 'react'
import { IconButton, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Button from '@mui/material/Button'
import { ISxStyles } from '../../interfaces/styles.interface'

const styles: ISxStyles = {
	alertBox: {
		border: '1px solid black',
		borderRadius: 10,
		padding: '10px 40px',
		maxWidth: '80%',
		margin: '10vh auto 20px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 200,
		backgroundColor: '#eee'
	},
	reloadBtn: {
		backgroundColor: '#7794aa !important'
	}
}

const ErrorAlert = () => {
	function handleClick() {
		localStorage.clear()
		window.location.reload()
	}

	return (
		<>
			<Grid sx={styles.alertBox} container>
				<IconButton size="large">
					<ErrorOutlineIcon color="error" fontSize="large" />
				</IconButton>
				<Typography variant="h4" align="center" color="red">
					Что-то пошло не так!
				</Typography>
			</Grid>
			<Typography align="center">
				<Button size="large" variant="outlined" component="span" disabled color="primary">
					Пожалуйста, проверьте подключение.
				</Button>
			</Typography>
			<hr />
			<Grid container justifyContent="center">
				<Button onClick={handleClick} sx={styles.reloadBtn} variant="contained">
					Обновить
				</Button>
			</Grid>
		</>
	)
}

export default ErrorAlert
