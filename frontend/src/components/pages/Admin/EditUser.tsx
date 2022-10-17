import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import makeStyles from '@mui/styles/makeStyles'
import AllowedPages from '../../UI/Layout/Navigation/AllowedPages'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'

const useStyles = makeStyles(theme => ({
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: 'crimson'
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		marginTop: theme.spacing(3),
		backgroundColor: '#fff',
		padding: 40
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
		padding: '10px 20px',
		minWidth: 250
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	chip: {
		margin: 2
	}
}))

export default function EditUser() {
	const classes = useStyles()
	const { editUser } = useActions()
	const [allowedPages, setAllowedPages] = useState<string[]>([])
	const { loading, user, error } = useTypedSelector(state => state.getUser)
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
	function handleEditUser(e: FormEvent) {
		e.preventDefault()
		editUser(user['ID'], { ...formData, allowedPages })
	}

	useEffect(() => {
		const btnStatus =
			!!formData.newUsername && !userNameHelperText && !passwordHelperText && !confirmPasswordHelperText && !loading
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

	useEffect(() => {
		if (user['ALLOWED_PAGES']) {
			setAllowedPages(user['ALLOWED_PAGES'].split(','))
			setFormData({ newUsername: user['USERNAME'], newPassword: '', confirmNewPassword: '' })
		}
	}, [user])

	return (
		<>
			{' '}
			{loading ? (
				<Loader />
			) : error ? (
				<Alert message={error} />
			) : (
				<>
					<Typography align="center" component="h1" variant="h5">
						<b>EDIT USER</b>
					</Typography>
					<form className={classes.form} noValidate onSubmit={handleEditUser}>
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
						<Button disabled={btnDisabled} type="submit" variant="outlined" color="primary" className={classes.submit}>
							Save
						</Button>
					</form>
				</>
			)}
		</>
	)
}
