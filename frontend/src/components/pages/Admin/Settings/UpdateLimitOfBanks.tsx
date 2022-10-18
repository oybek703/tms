import React, { memo, useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import { CardContent, TableContainer } from '@mui/material'
import Loader from '../../../UI/Layout/Loader'
import Alert from '../../../UI/Layout/Alert'
import { withToken } from '../../../../utils/axiosUtils'
import { formatNumber, getErrorMessage } from '../../../../utils'
import { toast } from 'react-toastify'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Table from '@mui/material/Table'
import { v4 as uuid } from 'uuid'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import useActions from '../../../../hooks/useActions'
import axios from 'axios'
import globalStyles from '../../../../styles/globalStyles'

const UpdateLimitOfBanks = () => {
	const { fetchBankLimits } = useActions()
	const [dialog, setDialog] = useState(false)
	const [editingCell, setEditingCell] = useState<any>({})
	const [newLimit, setNewLimit] = useState<any>('')
	const [beginDate, setBeginDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const { bankLimits = {}, loading, error } = useTypedSelector(state => state.bankLimits)
	const { dates, tableData = [] } = bankLimits
	const [months = {}] = dates || []
	const currencies = Object.keys(tableData[0] || {}).filter(key => key !== 'CLIENT_CODE' && key !== 'NAME')
	useEffect(() => {
		fetchBankLimits()
	}, [fetchBankLimits])
	useEffect(() => {
		if (months['BEGIN']) setBeginDate(months['BEGIN'])
		if (months['END']) setEndDate(months['END'])
	}, [months])

	async function handleDatesChange(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		try {
			await axios.post('/api/banklimits/updateDates', { beginDate, endDate }, withToken())
			fetchBankLimits()
		} catch (e) {
			const message = getErrorMessage(e)
			toast.error(message)
		}
	}

	function handleClose() {
		setNewLimit('')
		setDialog(false)
	}

	async function handleEdit() {
		try {
			await axios.post('/api/banklimits/updateLimit', { ...editingCell, newLimit }, withToken())
			handleClose()
			fetchBankLimits()
		} catch (e) {
			const message = getErrorMessage(e)
			toast.error(message)
		}
	}

	function handleEditClick(e: any) {
		const cellInfo = JSON.parse(e.target.dataset.cellinfo)
		setEditingCell(cellInfo)
		setDialog(true)
	}

	async function handleLimitChange(e: any) {
		if (e.key === 'Enter') {
			await handleEdit()
		}
	}

	return (
		<Paper>
			<CardContent>
				{loading ? (
					<Loader />
				) : error ? (
					<Alert message={error} />
				) : (
					<>
						<h2>Лимит банков</h2>
						<hr />
						{beginDate && endDate && (
							<>
								<h4>Срок действия</h4>
								<form onSubmit={handleDatesChange}>
									<label htmlFor="begin">С &nbsp;</label>
									<input value={beginDate} required onChange={e => setBeginDate(e.target.value)} type="date" /> &nbsp;
									&nbsp; &nbsp;
									<label htmlFor="end">До &nbsp;</label>
									<input value={endDate} required onChange={e => setEndDate(e.target.value)} type="date" />
									&nbsp; &nbsp; &nbsp;
									<button>Обновить срок</button>
								</form>
								<h4>Действующие лимиты операций с зарубежными банками</h4>
								<Typography color="primary" component="i">
									Нажмите на ячейку с пунктирной рамкой, чтобы изменить ее значение
								</Typography>
								<hr />
							</>
						)}
						{!dialog && (
							<TableContainer>
								<Table stickyHeader size="small" aria-label="a dense table">
									<TableHead>
										<TableRow>
											<TableCell>№</TableCell>
											<TableCell>Code</TableCell>
											<TableCell>Name</TableCell>
											{currencies.map(c => (
												<TableCell key={uuid()}>{c}</TableCell>
											))}
										</TableRow>
									</TableHead>
									<TableBody>
										{tableData.map((row: any, index: number) => (
											<TableRow key={uuid()}>
												<TableCell>{index + 1}</TableCell>
												<TableCell>{row['CLIENT_CODE']}</TableCell>
												<TableCell>{row['NAME']}</TableCell>
												{currencies.map(c => (
													<TableCell
														sx={{ ...globalStyles.noWrap, cursor: 'pointer' }}
														data-cellinfo={JSON.stringify({
															code: row['CLIENT_CODE'],
															name: row['NAME'],
															currency: c,
															value: row[c]
														})}
														onClick={handleEditClick}
														title="Нажмите, чтобы изменить"
														key={uuid()}
													>
														{formatNumber(row[c])}
													</TableCell>
												))}
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						)}
						<Dialog open={dialog} onClose={handleClose} aria-labelledby="form-dialog-title">
							<DialogTitle id="form-dialog-title">Обновить лимит</DialogTitle>
							<DialogContent>
								<DialogContentText>
									Имя: {editingCell['name']}
									<br />
									Код: {editingCell['code']}
									<br />
									Валюта: {editingCell['currency']}
									<br />
									Текущий лимит: {formatNumber(editingCell['value'])}
									<br />
								</DialogContentText>
								<TextField
									autoFocus
									value={newLimit}
									onKeyDown={handleLimitChange}
									onChange={({ target: { value } }) => setNewLimit(+value)}
									margin="dense"
									id="newLimit"
									label="Новый лимит"
									type="number"
									required
									fullWidth
								/>
							</DialogContent>
							<DialogActions>
								<Button variant="outlined" onClick={setDialog.bind(null, false)} color="primary">
									Отмена
								</Button>
								<Button variant="outlined" onClick={handleEdit} color="primary">
									Обновить
								</Button>
							</DialogActions>
						</Dialog>
					</>
				)}
			</CardContent>
		</Paper>
	)
}

export default memo(UpdateLimitOfBanks)
