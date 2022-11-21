import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import AllowedPages from '../../components/layout/Navigation/AllowedPages'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import globalStyles from '../../styles/globalStyles'
import axios from 'axios'
import { withToken } from '../../utils/axiosUtils'
import { getErrorMessage } from '../../utils'
import useTypedSelector from '../../hooks/useTypedSelector'

export default function EditUser() {
	const [allowedPages, setAllowedPages] = useState<string[]>([])
	const { singleUser, singleUserLoading } = useTypedSelector(state => state.admin)
	const [error, setError] = useState<string>('')
	const [formData, setFormData] = useState({ newUsername: '', newPassword: '', confirmNewPassword: '' })
	const [userNameHelperText, setUsernameHelperText] = useState('')
	const [passwordHelperText, setPasswordHelperText] = useState('')
	const [confirmPasswordHelperText, setConfirmPasswordHelperText] = useState('')
	const [btnDisabled, setBtnDisabled] = useState(true)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
		switch (name) {
			case 'newUsername':
				;/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(value)
					? setUsernameHelperText('')
					: setUsernameHelperText('Please enter valid username.')
				break
			case 'newPassword':
				value.length >= 6
					? setPasswordHelperText('')
					: setPasswordHelperText('Password should contain at least 6 characters.')
				break
			case 'confirmNewPassword':
				value === formData.newPassword
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

	async function handleEditUser(e: FormEvent) {
		e.preventDefault()
		try {
			// @ts-ignore
			await axios.put(`/api/users/${singleUser!.id}`, { ...formData, allowedPages }, withToken())
			window.location.reload()
		} catch (e) {
			const message = getErrorMessage(e)
			setError(message)
		}
	}

	useEffect(() => {
		const btnStatus =
			!!formData.newUsername &&
			!userNameHelperText &&
			!passwordHelperText &&
			!confirmPasswordHelperText &&
			!singleUserLoading
		setBtnDisabled(!btnStatus)
		// eslint-disable-next-line
    }, [formData, singleUserLoading])

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

	useEffect(() => {
		if (singleUser && singleUser!['allowedPages']) {
			// @ts-ignore
			setAllowedPages(singleUser!['allowedPages'].split(','))
			setFormData({ newUsername: singleUser['userName'], newPassword: '', confirmNewPassword: '' })
		}
	}, [singleUser])

	return (
		<>
			{' '}
			{error ? (
				<Loader />
			) : error ? (
				<Alert message={error} />
			) : (
				<>
					<Typography align="center" component="h1" variant="h5">
						<b>EDIT USER</b>
					</Typography>
					<Grid component="form" sx={globalStyles.userForm} noValidate onSubmit={handleEditUser}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									error={!!userNameHelperText}
									helperText={userNameHelperText}
									variant="outlined"
									fullWidth
									value={formData.newUsername}
									onChange={handleChange}
									id="username"
									label="Username"
									name="newUsername"
									autoComplete="off"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									error={!!passwordHelperText}
									helperText={passwordHelperText}
									variant="outlined"
									fullWidth
									value={formData.newPassword}
									onChange={handleChange}
									id="password"
									type="password"
									label="Password"
									name="newPassword"
									autoComplete="off"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									error={!!confirmPasswordHelperText}
									helperText={confirmPasswordHelperText}
									variant="outlined"
									fullWidth
									value={formData.confirmNewPassword}
									onChange={handleChange}
									name="confirmNewPassword"
									label="Confirm Password"
									type="password"
									id="confirm_password"
									autoComplete="off"
								/>
							</Grid>
							<AllowedPages pages={allowedPages} setPages={handleAddPage} />
						</Grid>
						<Button
							disabled={btnDisabled}
							type="submit"
							variant="outlined"
							color="primary"
							sx={globalStyles.usetSubmitBtn}
						>
							Save
						</Button>
					</Grid>
				</>
			)}
		</>
	)
}
