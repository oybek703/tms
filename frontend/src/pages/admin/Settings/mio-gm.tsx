import React, { FormEvent, useState } from 'react'
import CardContent from '@mui/material/CardContent'
import { Typography } from '@mui/material'
import TextField from '@mui/material/TextField'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import { withToken } from '../../../utils/axios-utils'
import { toast } from 'react-toastify'
import axios from 'axios'

const MioGm = () => {
	const [mioDate, setMioDate] = useState('')
	const [mioValue, setMioValue] = useState('')

	async function handleMioSubmit(event: FormEvent) {
		event.preventDefault()
		if (new Date(mioDate) > new Date()) {
			toast.error('Дата не должна быть больше, чем сегодня.')
			return
		}
		try {
			const {
				data: { message }
			} = await axios.put(`/api/gm/setmio`, { mio: mioValue, mioDate }, withToken())
			toast.success(message)
			setMioValue('')
			setMioDate('')
		} catch (e: any) {
			const { response = {} } = e
			const { data = {} } = response
			const { message } = data
			toast.error(message)
		}
	}

	return (
		<Card>
			<form onSubmit={handleMioSubmit}>
				<CardContent>
					<Typography component="b" variant="h5" gutterBottom>
						Непокрытый текущий аккредитив (МИО)
					</Typography>
					<hr />
					<Typography>
						Пожалуйста, добавьте значение MIO, если оно изменилось, в противном случае оно будет обновлено для выбранной
						даты, и новое значение не будет добавлено. &nbsp;
						<b>например:</b> 317700000.00 (в номинале)
					</Typography>
					<br />
					<TextField
						required
						id="gm-mio"
						type="number"
						margin="dense"
						label="МИО"
						value={mioValue}
						onChange={({ target: { value } }) => setMioValue(value)}
						autoComplete="off"
						placeholder="317700000.00"
						variant="outlined"
					/>{' '}
					&nbsp;
					<TextField
						required
						id="mio_date"
						margin="dense"
						variant="outlined"
						label="Date"
						value={mioDate}
						onChange={({ target: { value } }) => setMioDate(value)}
						type="date"
						InputLabelProps={{
							shrink: true
						}}
					/>
				</CardContent>
				<CardActions>
					<Button type="submit" size="small" variant="contained" color="primary">
						Добавлять
					</Button>
				</CardActions>
			</form>
		</Card>
	)
}

export default MioGm
