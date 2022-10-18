import React, { useCallback, useEffect, useState } from 'react'
import { withToken } from '../../../../utils/axiosUtils'
import { toast } from 'react-toastify'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import RotateLeftIcon from '@mui/icons-material/RotateLeft'
import SaveIcon from '@mui/icons-material/Save'
import Paper from '@mui/material/Paper'
import { getErrorMessage } from '../../../../utils'
import Loader from '../../../UI/Layout/Loader'
import Alert from '../../../UI/Layout/Alert'
import GapSimulationTable from './GapSimulationTable'
import GapSimulationDialog from './GapSimulationDialog'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import useActions from '../../../../hooks/useActions'
import axios from 'axios'
import { Grid } from '@mui/material'

interface ActionContentProps {
	handleReset: () => void
	handleSave: () => void
}

const ActionContent: React.FC<ActionContentProps> = function ({ handleReset, handleSave }) {
	return (
		<Grid sx={{ padding: '5px 10px' }}>
			<Grid sx={{ marginBottom: '5px' }}>
				<Button size="small" startIcon={<RotateLeftIcon />} variant="contained" color="primary" onClick={handleReset}>
					Reset
				</Button>
				&nbsp;
				<Button size="small" startIcon={<SaveIcon />} variant="contained" color="primary" onClick={handleSave}>
					Save
				</Button>
				&nbsp;
			</Grid>
			<Typography color="primary" component="i">
				<b>
					Обратите внимание, что редактировать можно только ячейки с пунктирной рамкой и не забудьте сохранить ваши
					изменения, иначе они будут сброшены.
				</b>
				<b> Для редактирования значения ячейки щелкните по этой ячейке.</b>
			</Typography>
		</Grid>
	)
}

const GapSimulation = () => {
	const { fetchGapManual } = useActions()
	const [newValue, setNewValue] = useState<any>('')
	const [dialog, setDialog] = useState(false)
	const [editingCell, setEditingCell] = useState<any>({})
	const { gapManual = {}, loading, error } = useTypedSelector(state => state.gapManual)
	const {
		months = [],
		sourceOfLiquidity = [],
		sourceOfLiquidityTotal = [],
		needsOfLiquidity = [],
		needsOfLiquidityTotal = [],
		vlaLcrData = []
	} = gapManual

	function handleClose() {
		setDialog(false)
		setNewValue('')
	}

	const handleEdit = useCallback(
		async function handleEdit() {
			try {
				await axios.post(
					'/api/gapSimulation/update',
					{
						colName: editingCell['colName'],
						newValue,
						role: editingCell['role'],
						date: editingCell['monthIndex'],
						source: editingCell['source']
					},
					withToken()
				)
				handleClose()
				fetchGapManual(true)
			} catch (e) {
				const message = getErrorMessage(e)
				toast.error(message)
			}
		},
		[fetchGapManual, editingCell, newValue]
	)

	const handleNewValueChange = useCallback(
		async function handleNewValueChange(e: any) {
			if (e.key === 'Enter') {
				await handleEdit()
			}
		},
		[handleEdit]
	)

	const handleEditClick = useCallback((event: any) => {
		const cellInfo = JSON.parse(event.target.dataset.cellinfo || '{}')
		setEditingCell(cellInfo)
		setDialog(true)
	}, [])

	useEffect(() => {
		setNewValue(+(editingCell['numValue'] || 0).toFixed(2))
	}, [editingCell])
	const handleReset = useCallback(() => {
		const option = window.confirm('Вы уверены, что хотите сбросить разрыв до исходного состояния?')
		if (option) {
			fetchGapManual()
		}
	}, [fetchGapManual])
	const handleSave = useCallback(async () => {
		const option = window.confirm('Вы уверены, что хотите сохранить изменения?')
		if (option) {
			try {
				await axios.put('/api/gapSimulation/saveChanges', {}, withToken())
				toast.success('Изменения успешно сохранены.')
				fetchGapManual()
			} catch (e) {
				const message = getErrorMessage(e)
				toast.error(message)
			}
		}
	}, [fetchGapManual])
	useEffect(() => {
		fetchGapManual()
		return function () {
			fetchGapManual()
		}
	}, [fetchGapManual])

	useEffect(() => {
		window.addEventListener('beforeunload', alertUser)
		return () => {
			window.removeEventListener('beforeunload', alertUser)
		}
	}, [])
	const alertUser = (e: BeforeUnloadEvent) => {
		e.preventDefault()
		e.returnValue = ''
	}
	return (
		<Paper>
			{loading ? (
				<Loader />
			) : error ? (
				<Alert message={error} />
			) : (
				<>
					<ActionContent handleReset={handleReset} handleSave={handleSave} />
					{!dialog && (
						<GapSimulationTable
							handleEditClick={handleEditClick}
							months={months}
							needsOfLiquidity={needsOfLiquidity}
							vlaLcrData={vlaLcrData}
							sourceOfLiquidity={sourceOfLiquidity}
							needsOfLiquidityTotal={needsOfLiquidityTotal}
							sourceOfLiquidityTotal={sourceOfLiquidityTotal}
						/>
					)}
					<GapSimulationDialog
						dialog={dialog}
						editingCell={editingCell}
						setNewValue={setNewValue}
						handleClose={handleClose}
						setDialog={setDialog}
						handleEdit={handleEdit}
						handleNewValueChange={handleNewValueChange}
						newValue={newValue}
					/>
				</>
			)}
		</Paper>
	)
}

export default GapSimulation
