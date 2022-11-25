import React, { ChangeEvent, Fragment, memo, PropsWithChildren, useCallback, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import { CAABankData, CAAChangeHistory, ICorrAccountsAnalyze } from '../../interfaces/caa.interfaces'
import CorrAccountsHeadAnalyzeHead from '../helpers/corrAccountsAnalyze/CorrAccountsHeadAnalyzeHead'
import { v4 as uuid } from 'uuid'
import { FormControlLabel, Radio, RadioGroup, TableCell, TableRow, FormControl, FormLabel, Button } from '@mui/material'
import globalStyles from '../../styles/globalStyles'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import useActions from '../../hooks/useActions'
import axios from 'axios'
import { toast } from 'react-toastify'
import { withToken } from '../../utils/axiosUtils'
import palette from '../../styles/palette'
import useTypedSelector from '../../hooks/useTypedSelector'
import ButtonTabs from '../layout/Tabs/ButtonsTab'
import { GridColDef } from '@mui/x-data-grid'
import StyledDataGrid from '../layout/StyledDataGrid'

interface CAAManualTableProps {
	rows: {
		corrAccountsAnalyze: ICorrAccountsAnalyze[]
		caaUpdateHistory: CAAChangeHistory[]
	}
}

interface EditableCellProps {
	matrixId: number
	colName: keyof CAABankData
}

const EditableCell: React.FC<PropsWithChildren<EditableCellProps>> = ({ children, matrixId, colName }) => {
	const { fetchCaaManual } = useActions()
	async function handleClick() {
		try {
			const value = children === '1' ? null : 1
			await axios.put('/api/caaManual', { matrixId, value, colName }, withToken())
			fetchCaaManual()
		} catch (e) {
			if (axios.isAxiosError(e)) {
				toast.error(e.message)
			}
			console.log(e)
		}
	}

	return (
		<TableCell
			title="Нажмите чтобы изменит состояние ячейка"
			sx={{
				boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
				transition: 'box-shadow 0.3s ease-in-out',
				'&:hover': {
					boxShadow: '0 5px 15px rgba(0, 0, 0, 0.8)',
					cursor: 'pointer'
				}
			}}
			align="center"
			onClick={handleClick}
		>
			{children === '1' ? <CheckBoxIcon sx={{ color: palette.lightGreen }} /> : null}
		</TableCell>
	)
}

const OptionEditableCell: React.FC<PropsWithChildren<EditableCellProps>> = ({ children, matrixId, colName }) => {
	const { fetchCaaManual } = useActions()
	const [editing, setEditing] = useState<boolean>(false)
	const [status, setStatus] = useState<string>(typeof children === 'string' ? children : 'пустой')

	async function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const newValue = event.target.value
		const value = newValue === 'пустой' ? null : event.target.value
		try {
			setStatus(newValue)
			await axios.put('/api/caaManual', { matrixId, value, colName }, withToken())
			fetchCaaManual()
		} catch (e) {
			if (axios.isAxiosError(e)) {
				toast.error(e.message)
			}
			console.log(e)
		}
	}

	return (
		<TableCell
			title="Нажмите чтобы изменит состояние ячейка"
			sx={{
				boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
				transition: 'box-shadow 0.3s ease-in-out',
				position: 'relative',
				'&:hover': {
					boxShadow: '0 5px 15px rgba(0, 0, 0, 0.8)',
					cursor: 'pointer'
				}
			}}
			align="center"
			onClick={() => setEditing(!editing)}
			onMouseLeave={() => setEditing(false)}
		>
			{editing ? (
				<FormControl>
					<RadioGroup
						sx={{
							width: 'auto',
							height: 'auto',
							position: 'fixed',
							backgroundColor: '#eee',
							padding: '5px 10px',
							borderRadius: '4px',
							zIndex: 10000
						}}
						value={status}
						onChange={handleChange}
					>
						<FormControlLabel value={'пустой'} control={<Radio />} label={'пустой'} />
						<FormControlLabel value={'большой'} control={<Radio />} label={'большой'} />
						<FormControlLabel value={'высокая'} control={<Radio />} label={'высокая'} />
						<FormControlLabel value={'средняя'} control={<Radio />} label={'средняя'} />
					</RadioGroup>
				</FormControl>
			) : (
				children
			)}
		</TableCell>
	)
}

const titles = [
	{ title: 'Данные', code: 'data' },
	{ title: 'История', code: 'history' }
]

function generateCellAttrs<T extends GridColDef>(colDef: T): T {
	return {
		type: 'string',
		headerName: '№',
		flex: 1,
		valueFormatter: undefined,
		align: 'center',
		headerAlign: 'center',
		filterable: true,
		disableColumnMenu: false,
		sortable: true,
		...colDef
	}
}

const columns: GridColDef[] = [
	generateCellAttrs({ field: 'index', sortable: false, flex: 0, maxWidth: 10, disableColumnMenu: true }),
	generateCellAttrs({
		field: 'userName',
		headerName: 'Имя пользователя',
		minWidth: 200
	}),
	generateCellAttrs({
		field: 'dateModify',
		headerName: 'Время изменение',
		minWidth: 200
	}),
	generateCellAttrs({
		field: 'bankName',
		headerName: 'Наим.банка',
		minWidth: 200
	}),
	generateCellAttrs({
		field: 'colName',
		headerName: 'Свойство',
		minWidth: 200
	}),
	generateCellAttrs({
		field: 'description',
		headerName: 'Описание',
		valueFormatter: function ({ value }) {
			return `${value.replace(/null/g, '❌').replace(/1/g, '✅')}`
		}
	})
]

const CAAManualTable: React.FC<CAAManualTableProps> = ({ rows }) => {
	const { corrAccountsAnalyze } = rows
	const {
		caaManual: { caaUpdateHistory }
	} = useTypedSelector(state => state.corrAccountsAnalyze)
	const [expanded, setExpanded] = useState<string>('data')
	const handleChange = useCallback((code: string) => {
		setExpanded(code)
	}, [])
	return (
		<>
			<ButtonTabs handleChange={handleChange} active={expanded} titles={titles} />
			{expanded === 'data' ? (
				<TableContainer component={Paper}>
					<Table size="small" aria-label="a dense table">
						<CorrAccountsHeadAnalyzeHead />
						<TableBody>
							{corrAccountsAnalyze.map(({ codeCurrency, banks }) => (
								<Fragment key={uuid()}>
									<TableRow>
										<TableCell colSpan={2} align="center">
											<b>{codeCurrency}</b>
										</TableCell>
										<TableCell colSpan={17} />
									</TableRow>
									{banks.map((bank, index) => (
										<TableRow key={uuid()}>
											<TableCell align="center">{index + 1}</TableCell>
											<TableCell sx={globalStyles.noWrap}>
												<b>{bank.bankName}</b>
											</TableCell>
											<TableCell>{bank.countryCode}</TableCell>
											<EditableCell colName={'imports'} matrixId={bank.id}>
												{bank.imports}
											</EditableCell>
											<EditableCell colName={'exports'} matrixId={bank.id}>
												{bank.exports}
											</EditableCell>
											<EditableCell colName={'tradingFin'} matrixId={bank.id}>
												{bank.tradingFin}
											</EditableCell>
											<EditableCell colName={'mbd'} matrixId={bank.id}>
												{bank.mbd}
											</EditableCell>
											<EditableCell colName={'fx'} matrixId={bank.id}>
												{bank.fx}
											</EditableCell>
											<EditableCell colName={'creditLine'} matrixId={bank.id}>
												{bank.creditLine}
											</EditableCell>
											<EditableCell colName={'vostro'} matrixId={bank.id}>
												{bank.vostro}
											</EditableCell>
											<EditableCell colName={'otherOperations'} matrixId={bank.id}>
												{bank.otherOperations}
											</EditableCell>
											<EditableCell colName={'corrAccounts'} matrixId={bank.id}>
												{bank.corrAccounts}
											</EditableCell>
											<EditableCell colName={'genAgreement'} matrixId={bank.id}>
												{bank.genAgreement}
											</EditableCell>
											<EditableCell colName={'isda'} matrixId={bank.id}>
												{bank.isda}
											</EditableCell>
											<EditableCell colName={'otherAgreement'} matrixId={bank.id}>
												{bank.otherAgreement}
											</EditableCell>
											<OptionEditableCell colName={'serviceSize'} matrixId={bank.id}>
												{bank.serviceSize}
											</OptionEditableCell>
											<OptionEditableCell colName={'serviceSpeed'} matrixId={bank.id}>
												{bank.serviceSpeed}
											</OptionEditableCell>
											<OptionEditableCell colName={'serviceQuality'} matrixId={bank.id}>
												{bank.serviceQuality}
											</OptionEditableCell>
											<OptionEditableCell colName={'serviceCost'} matrixId={bank.id}>
												{bank.serviceCost}
											</OptionEditableCell>
										</TableRow>
									))}
								</Fragment>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<StyledDataGrid rows={caaUpdateHistory} columns={columns} />
			)}
		</>
	)
}

export default memo(CAAManualTable)
