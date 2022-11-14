import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import AllowedPages from '../../components/layout/Navigation/AllowedPages'
import globalStyles from '../../styles/globalStyles'
import { getErrorMessage } from '../../utils'
import axios from 'axios'
import { withToken } from '../../utils/axiosUtils'

export default function AddUser() {
	const [allowedPages, setAllowedPages] = useState<string[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const [formData, setFormData] = useState({ userName: '', password: '', confirmPassword: '' })
	const [userNameHelperText, setUsernameHelperText] = useState('')
	const [passwordHelperText, setPasswordHelperText] = useState('')
	const [confirmPasswordHelperText, setConfirmPasswordHelperText] = useState('')
	const [btnDisabled, setBtnDisabled] = useState(true)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
			case 'confirmPassword':
				value === formData.password
					? setConfirmPasswordHelperText('')
					: setConfirmPasswordHelperText('Password confirmation should match.')
				break
			default:
				return
		}
	}

	const handleAddPage = useCallback((newPages: string[]) => {
		setAllowedPages(Array.from(newPages))
	}, [])

	async function handleAddUser(e: FormEvent) {
		try {
			e.preventDefault()
			setLoading(true)
			await axios.post(`/api/users/addUser`, { ...formData, allowedPages }, withToken())
			setLoading(false)
			window.location.reload()
		} catch (e) {
			const message = getErrorMessage(e)
			setError(message)
			setLoading(false)
		}
	}

	useEffect(() => {
		const btnStatus =
			!!formData.userName &&
			!!formData.password &&
			!!formData.confirmPassword &&
			!userNameHelperText &&
			!passwordHelperText &&
			!confirmPasswordHelperText &&
			!loading
		setBtnDisabled(!btnStatus)
		// eslint-disable-next-line
    }, [formData, loading])

	useEffect(() => {
		if (error) {
			switch (error) {
				case 'match_password':
					setConfirmPasswordHelperText('Password confirmation should match.')
					break
				case 'user_exists':
					setUsernameHelperText('Username already exists. Please choose another username')
					break
				default:
					return
			}
		}
		// eslint-disable-next-line
    }, [error])

	return (
		<>
			<Typography align="center" component="h1" variant="h5">
				<b>ADD NEW USER</b>
			</Typography>
			<Grid component="form" sx={globalStyles.userForm} noValidate onSubmit={handleAddUser}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							error={!!userNameHelperText}
							helperText={userNameHelperText}
							variant="outlined"
							fullWidth
							value={formData.userName}
							onChange={handleChange}
							id="username"
							label="Username"
							name="userName"
							autoComplete="off"
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							error={!!passwordHelperText}
							helperText={passwordHelperText}
							variant="outlined"
							fullWidth
							value={formData.password}
							onChange={handleChange}
							id="password"
							type="password"
							label="Password"
							name="password"
							autoComplete="off"
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							error={!!confirmPasswordHelperText}
							helperText={confirmPasswordHelperText}
							variant="outlined"
							fullWidth
							value={formData.confirmPassword}
							onChange={handleChange}
							name="confirmPassword"
							label="Confirm Password"
							type="password"
							id="confirm_password"
							autoComplete="off"
						/>
					</Grid>
					<AllowedPages pages={allowedPages} setPages={handleAddPage} />
				</Grid>
				<Button disabled={btnDisabled} type="submit" variant="outlined" color="primary" sx={globalStyles.usetSubmitBtn}>
					Add
				</Button>
			</Grid>
		</>
	)
}
