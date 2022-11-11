import React, { FormEvent, useCallback, useState } from 'react'
import CardContent from '@mui/material/CardContent'
import { Typography } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'
import { withToken } from '../../../utils/axios-utils'
import Alert from '../../../components/UI/Layout/Alert'
import axios from 'axios'

const CbnUpdate = () => {
	const [updateMsg, setUpdateMsg] = useState('')
	const [dialog, setDialog] = useState(false)
	const [fromDate, setFromDate] = useState('')
	const [toDate, setToDate] = useState('')
	const [cbNorm, setCbNorm] = useState('')
	const [dateError, setDateError] = useState('')
	const handleDialogClose = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			if (toDate > fromDate) {
				try {
					const {
						data: { message }
					} = await axios.put(`/api/calcfor/updatecbn`, { fromDate, toDate, cbNorm }, withToken())
					localStorage.removeItem('calcfor')
					setUpdateMsg(message)
					setDialog(false)
					setToDate('')
					setFromDate('')
					setCbNorm('')
					setTimeout(() => setUpdateMsg(''), 3000)
				} catch (e) {
					console.log(e)
				}
			} else {
				setDateError('To date must be bigger than from date.')
			}
		},
		[cbNorm, fromDate, toDate]
	)

	return (
		<>
			<Card>
				<CardContent>
					{updateMsg && (
						<Grid container justifyContent="flex-start">
							<Alert type="success" message={updateMsg} />
						</Grid>
					)}
					<Typography component="b" variant="h5" gutterBottom>
						Обновить или ввести норматив центрального банка за период
					</Typography>
					<hr />
					<Typography variant="body2">
						Для обновления норматив центрального банка введите число полученное от центрального банка разделив на 1000,
						&nbsp;
						<b>например:</b> если норматив центрального банка равен 883522858640.53, тогда вам нужно ввести 883522858.64
					</Typography>
				</CardContent>
				<CardActions>
					<Button onClick={() => setDialog(true)} size="small" variant="contained" color="primary">
						Нажмите, чтобы обновить
					</Button>
				</CardActions>
			</Card>
			<Dialog open={dialog} onClose={() => setDialog(false)} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Update CB Norm</DialogTitle>
				<form onSubmit={handleDialogClose}>
					<DialogContent>
						<Grid container spacing={3} justifyContent="space-between" alignItems="center">
							<Grid item>
								<TextField
									required
									id="from_date"
									label="From"
									value={fromDate}
									onChange={({ target: { value } }) => setFromDate(value)}
									type="date"
									InputLabelProps={{
										shrink: true
									}}
								/>
							</Grid>
							<Grid item>
								<TextField
									required
									id="to_date"
									label="To"
									value={toDate}
									onChange={({ target: { value } }) => setToDate(value)}
									type="date"
									InputLabelProps={{
										shrink: true
									}}
									error={!!dateError}
									helperText={dateError}
								/>
							</Grid>
						</Grid>
						<TextField
							required
							autoFocus
							margin="dense"
							id="norm"
							placeholder="883522858.64"
							label="CB Norm"
							value={cbNorm}
							onChange={({ target: { value } }) => setCbNorm(value)}
							type="number"
							inputProps={{ step: 'any' }}
							fullWidth
						/>
					</DialogContent>
					<DialogActions>
						<Button variant="outlined" onClick={() => setDialog(false)} color="primary">
							Cancel
						</Button>
						<Button type="submit" variant="outlined" color="primary">
							Update
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	)
}

export default CbnUpdate
