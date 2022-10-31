import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Button, CardContent, IconButton } from '@mui/material'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import CircularProgress from '@mui/material/CircularProgress'
import { Redirect } from 'react-router-dom'
import { parse } from 'query-string'
import { toast } from 'react-toastify'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions1 from '../../hooks/useActions1'
import globalStyles from '../../styles/globalStyles'
import { ISxStyles } from '../../interfaces/styles.interface'

const styles: ISxStyles = {
	formFields: {
		minWidth: '40em',
		margin: '1em auto 2.5em',
		textAlign: 'center'
	}
}

const LoginPage = () => {
	const { login } = useActions1()
	const {
		user: { token },
		loading,
		error
	} = useTypedSelector(state => state.auth)
	const [formData, setFormData] = useState({ userName: '', password: '' })
	const [usernameHelperText, setUsernameHelperText] = useState('')
	const [passwordHelperText, setPasswordHelperText] = useState('')
	const [btnDisabled, setBtnDisabled] = useState(true)
	const [showPassword, setShowPassword] = useState(false)
	const { redirectTo } = parse(window.location.search)
	const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
		switch (name) {
			case 'username':
				;/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(value)
					? setUsernameHelperText('')
					: setUsernameHelperText('Please enter valid username.')
				break
			case 'password':
				value.length >= 6
					? setPasswordHelperText('')
					: setPasswordHelperText('Password should contain at least 6 characters.')
				break
			default:
				return
		}
	}
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		login(formData)
	}
	useEffect(() => {
		const btnStatus = !!formData.userName && !!formData.password && !loading
		setBtnDisabled(!btnStatus)
		// eslint-disable-next-line
    }, [formData, loading])
	useEffect(() => {
		if (error) {
			switch (error) {
				case 'Invalid username.':
					setUsernameHelperText('User not found or deleted.')
					break
				case 'Invalid password.':
					setPasswordHelperText('Invalid user password.')
					break
				default:
					toast.error(error, { position: 'bottom-center' })
			}
		}
	}, [error])
	if (token) {
		// @ts-ignore
		return <Redirect to={redirectTo === '/' || !redirectTo ? '/' : redirectTo} />
	}
	return (
		<Grid container direction="column" alignItems="center" justifyContent="center" sx={{ margin: '50px auto' }}>
			<Grid item>
				<Grid sx={{ marginTop: '-80px', marginBottom: '-60px' }}>
					<Grid>
						<img src={process.env.PUBLIC_URL + '/asakabank.jpg'} width="350" height="300" alt="Treasury Reports" />
					</Grid>
				</Grid>
				<br />
			</Grid>
			<Grid item>
				<Typography
					sx={{
						color: '#000',
						textTransform: 'uppercase',
						fontWeight: 'bold'
					}}
					variant="h5"
					gutterBottom
					align="center"
				>
					Treasury Management System
				</Typography>
			</Grid>
			<Grid item>
				<Card sx={{ backgroundColor: 'white', padding: '30px 20px' }} elevation={12} variant="elevation">
					<CardContent>
						<form onSubmit={handleSubmit} autoComplete="on" autoSave="on">
							<Grid container sx={styles.formFields} justifyContent="center">
								<TextField
									error={!!usernameHelperText}
									helperText={usernameHelperText}
									name="userName"
									value={formData.userName}
									onChange={handleChange}
									variant="outlined"
									fullWidth
									label="Username*"
								/>
							</Grid>
							<Grid container sx={styles.formFields} justifyContent="center">
								<TextField
									type={showPassword ? 'text' : 'password'}
									error={!!passwordHelperText}
									helperText={passwordHelperText}
									name="password"
									value={formData.password}
									onChange={handleChange}
									variant="outlined"
									fullWidth
									label="Password*"
									InputProps={{
										endAdornment: (
											<IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
												{showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
											</IconButton>
										)
									}}
								/>
							</Grid>
							<Grid container justifyContent="center">
								<Button
									type="submit"
									disabled={btnDisabled}
									size="large"
									variant="contained"
									fullWidth
									sx={globalStyles.blueBackground}
									endIcon={loading && <CircularProgress size="20px" />}
								>
									Sign In
								</Button>
							</Grid>
						</form>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	)
}

export default LoginPage
