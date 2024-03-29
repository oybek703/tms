import React, { useCallback, useEffect, useState } from 'react'
import { withToken } from '../../../utils/axiosUtils'
import { toast } from 'react-toastify'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import RotateLeftIcon from '@mui/icons-material/RotateLeft'
import SaveIcon from '@mui/icons-material/Save'
import Paper from '@mui/material/Paper'
import { getErrorMessage } from '../../../utils'
import GapSimulationTable from './GapSimulationTable'
import GapSimulationDialog from './GapSimulationDialog'
import useTypedSelector from '../../../hooks/useTypedSelector'
import useActions from '../../../hooks/useActions'
import axios from 'axios'
import { Grid } from '@mui/material'
import { LoaderWrapper } from '../../../components/helpers/LoaderWrapper'

interface ActionContentProps {
	handleReset: () => void
	handleSave: () => void
}

const ActionContent: React.FC<ActionContentProps> = function ({ handleReset, handleSave }) {
	return (
		<Grid sx={{ padding: '5px 10px' }} component={Paper}>
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
	const { fetchGapSimulation } = useActions()
	const [newValue, setNewValue] = useState<any>('')
	const [dialog, setDialog] = useState(false)
	const [editingCell, setEditingCell] = useState<any>({})
	const { gapSimulation, gapSimulationLoading, gapSimulationError } = useTypedSelector(state => state.gap)
	const {
		months = [],
		sourceOfLiquidity = [],
		sourceOfLiquidityTotal = [],
		needsOfLiquidity = [],
		needsOfLiquidityTotal = [],
		vlaLcrData = [],
		lcrData = [],
		nsfrData = []
	} = gapSimulation

	function handleClose() {
		setDialog(false)
		setNewValue('')
	}

	const handleEdit = useCallback(
		async function handleEdit() {
			try {
				await axios.post(
					'/api/gapManual',
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
				fetchGapSimulation({ forEditing: true })
			} catch (e) {
				const message = getErrorMessage(e)
				toast.error(message)
			}
		},
		[fetchGapSimulation, editingCell, newValue]
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
			fetchGapSimulation()
		}
	}, [fetchGapSimulation])
	const handleSave = useCallback(async () => {
		const option = window.confirm('Вы уверены, что хотите сохранить изменения?')
		if (option) {
			try {
				await axios.put('/api/gapManual', {}, withToken())
				toast.success('Изменения успешно сохранены.')
				fetchGapSimulation()
			} catch (e) {
				const message = getErrorMessage(e)
				toast.error(message)
			}
		}
	}, [fetchGapSimulation])
	useEffect(() => {
		fetchGapSimulation()
		return function () {
			fetchGapSimulation()
		}
	}, [fetchGapSimulation])

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
		<LoaderWrapper loading={gapSimulationLoading} error={gapSimulationError}>
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
					nsfrData={nsfrData}
					lcrData={lcrData}
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
		</LoaderWrapper>
	)
}

export default GapSimulation
