import React, { Fragment, memo, PropsWithChildren, useEffect, useRef, useState, FormEvent } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { CircularProgress, Grid, Tooltip, Typography } from '@mui/material'
import useTypedSelector from '../../hooks/useTypedSelector'
import TableCap from '../helpers/TableCap'
import globalStyles from '../../styles/globalStyles'
import { ISxStyles } from '../../interfaces/styles.interface'
import { format } from 'date-fns'
import BoldWithColor from '../helpers/BoldWithColor'
import { v4 as uuid } from 'uuid'
import { formatNumber, getErrorMessage } from '../../utils'
import { singleColouredRow } from './LiqPointersTable'
import palette from '../../styles/palette'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { IFlowsRow } from '../../interfaces/vlaAndFor.interfaces'
import axios from 'axios'
import { APIRoutes } from '../../interfaces/apiRoutes.interface'
import { withToken } from '../../utils/axiosUtils'
import { toast } from 'react-toastify'
import useActions from '../../hooks/useActions'

const styles: ISxStyles = {
	tableContainer: {
		padding: 0,
		marginBottom: '20px'
	},
	titleTextStyles: {
		fontSize: 60,
		color: '#fff',
		fontWeight: 'bold'
	},
	flowsGrid: {
		display: 'grid',
		gridAutoFlow: 'column',
		gridTemplateColumns: '62% 37% 1% ',
		columnGap: '20px'
	},
	editCellHoverStyles: {
		'&:hover': {
			fontWeight: `bold`,
			cursor: 'pointer',
			border: `5px solid ${palette.lightGreen}`
		}
	}
}

const WhiteCell = () => {
	return <TableCell sx={{ backgroundColor: 'white', border: 'none' }} />
}

interface IFormattedCellProps extends PropsWithChildren {
	backgroundColor: string
}

const FormattedCell = ({ children, backgroundColor }: IFormattedCellProps) => {
	return (
		<TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '30px', backgroundColor, ...globalStyles.noWrap }}>
			{children}
		</TableCell>
	)
}

enum FlowTypes {
	inFlow = 'Приток',
	outFlow = 'Отток'
}

type UpdateColNameTypes = keyof Omit<IFlowsRow, 'indicatorType' | 'indicatorName' | 'indicatorId'>

const VlaAndForTable = () => {
	const [updateLoading, setUpdateLoading] = useState<boolean>(false)
	const { fetchVlaAndFor } = useActions()
	const [updateColName, setUpdateColName] = useState<UpdateColNameTypes | undefined>(undefined)
	const dialogRef = useRef<HTMLInputElement | null>(null)
	const [dialogData, setDialogData] = useState<IFlowsRow | null>(null)
	const [vlaPercentValue, setVlaPercentValue] = useState<number>(0)
	const [current, setCurrent] = useState<number>(0)
	const [differ, setDiffer] = useState<number>(0)
	const { reportDate } = useTypedSelector(state => state.operDays)
	const { vlaAndFor } = useTypedSelector(state => state.vlaAndFor)
	const { liquidityAssets, inFlow, outFlow } = vlaAndFor
	const handleDialogOpen = (d: IFlowsRow, colName: UpdateColNameTypes) => {
		setUpdateColName(colName)
		setDialogData(d)
	}
	const updateFlowData = async (event: FormEvent) => {
		event.preventDefault()
		const newValue = dialogRef.current?.value
		if (newValue) {
			try {
				setUpdateLoading(true)
				await axios.post(APIRoutes.vlaAndFor, { ...dialogData, [`${updateColName}`]: newValue }, withToken())
				setUpdateLoading(false)
				fetchVlaAndFor()
			} catch (e: unknown) {
				setUpdateLoading(false)
				const message = getErrorMessage(e)
				if (message === 'Unauthorized') {
					localStorage.clear()
					window.location.reload()
				}
				toast.error(message)
			}
		}
	}
	useEffect(() => {
		if (liquidityAssets.length !== 0) {
			const newCurrent = liquidityAssets.reduce((acc, val, index) => {
				if ([1, 2, 6].includes(index)) {
					acc += val.currentNatCurr
				}
				if (index === 7) acc -= val.currentNatCurr
				return acc
			}, 0)
			setCurrent(newCurrent)
			setVlaPercentValue(liquidityAssets[0].currentNatCurr)
			setDiffer(liquidityAssets[0].currentNatCurr * 0.11 - newCurrent)
		}
	}, [liquidityAssets])
	return (
		<Fragment>
			<TableContainer sx={styles.tableContainer} component={Paper}>
				<Table size="small" aria-label="a dense table">
					<TableCap rows={11} text={'млн.'} />
					<TableHead sx={globalStyles.stickyTableHead}>
						<TableRow>
							<TableCell rowSpan={2} />
							<TableCell rowSpan={2} align="center">
								<Typography sx={styles.titleTextStyles}>Активы</Typography>
							</TableCell>
							<TableCell colSpan={5} align="center">
								<Typography color="white" variant="h4">
									{format(new Date(reportDate), 'dd.MM.yyyy')}
								</Typography>
							</TableCell>
							<WhiteCell />
							<TableCell sx={{ fontSize: '24px', fontWeight: '550', color: 'white' }} colSpan={3} align="center">
								Текущий
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="center">
								<BoldWithColor> Итого</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor> Национальная валюта</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor> Иностранная валюта в суммовом эквиваленте</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor> Долл. США</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor> Евро</BoldWithColor>
							</TableCell>
							<WhiteCell />
							<TableCell align="center">
								<BoldWithColor> Национальная валюта</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor> Иностранная валюта в суммовом эквиваленте</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor> Итого</BoldWithColor>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{liquidityAssets.map((row, index) => (
							<Fragment key={uuid()}>
								{row.indicatorName === singleColouredRow ? (
									<TableRow sx={{ backgroundColor: '#b4c6cf' }}>
										<TableCell align="center">
											<b>{index + 1}</b>
										</TableCell>
										<TableCell>
											<b>{row.indicatorName}</b>
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											<b>{formatNumber(row.total)}%</b>
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											<b>{formatNumber(row.natCurr)}%</b>
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											<b>{formatNumber(row.forCurr)}%</b>
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											<b>{formatNumber(row.usaDollar)}%</b>
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											<b>{formatNumber(row.evro)}%</b>
										</TableCell>
										<WhiteCell />
										<TableCell align="center" sx={globalStyles.noWrap}>
											<b>{formatNumber(row.currentNatCurr)}%</b>
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											<b>{formatNumber(row.currentForCurr)}%</b>
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											<b>{formatNumber(row.currentTotal)}%</b>
										</TableCell>
									</TableRow>
								) : (
									<TableRow hover>
										<TableCell align="center">{row['isTableHead'] ? <b>{index + 1}</b> : index + 1}</TableCell>
										<TableCell align="left">
											{row['isTableHead'] ? <b>{row.indicatorName}</b> : row.indicatorName}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{row['isTableHead'] ? <b>{formatNumber(row.total)}</b> : formatNumber(row.total)}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{row['isTableHead'] ? (
												<b>{formatNumber(row['natCurr'], true)}</b>
											) : (
												formatNumber(row['natCurr'], true)
											)}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{row['isTableHead'] ? (
												<b>{formatNumber(row['forCurr'], true)}</b>
											) : (
												formatNumber(row['forCurr'], true)
											)}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{row['isTableHead'] ? (
												<b>{formatNumber(row['usaDollar'], true)}</b>
											) : (
												formatNumber(row['usaDollar'], true)
											)}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{row['isTableHead'] ? <b>{formatNumber(row['evro'], true)}</b> : formatNumber(row['evro'], true)}
										</TableCell>
										<WhiteCell />
										<TableCell sx={globalStyles.noWrap} align="center">
											{row['isTableHead'] ? (
												<b>{formatNumber(row['currentNatCurr'], true)}</b>
											) : (
												formatNumber(row['currentNatCurr'], true)
											)}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{row['isTableHead'] ? (
												<b>{formatNumber(row['currentForCurr'], true)}</b>
											) : (
												formatNumber(row['currentForCurr'], true)
											)}
										</TableCell>
										<TableCell sx={globalStyles.noWrap} align="center">
											{row['isTableHead'] ? (
												<b>{formatNumber(row['currentTotal'], true)}</b>
											) : (
												formatNumber(row['currentTotal'], true)
											)}
										</TableCell>
									</TableRow>
								)}
							</Fragment>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Grid sx={styles.flowsGrid}>
				<Grid>
					{[
						{ title: FlowTypes.inFlow, data: inFlow },
						{ title: FlowTypes.outFlow, data: outFlow }
					].map(({ title, data }) => (
						<TableContainer key={uuid()} sx={styles.tableContainer} component={Paper}>
							<Table size="small" aria-label="a dense table">
								<TableCap rows={6} text={'млн.'} />
								<TableHead sx={globalStyles.stickyTableHead}>
									<TableRow>
										<TableCell sx={{ maxWidth: '2px' }} align="center">
											<BoldWithColor>№</BoldWithColor>
										</TableCell>
										<TableCell>
											<BoldWithColor>{title}</BoldWithColor>
										</TableCell>
										<TableCell align="center">
											<BoldWithColor>UZS</BoldWithColor>
										</TableCell>
										<TableCell align="center">
											<BoldWithColor>USD</BoldWithColor>
										</TableCell>
										<TableCell align="center">
											<BoldWithColor>EUR</BoldWithColor>
										</TableCell>
										<TableCell align="center">
											<BoldWithColor>RUB</BoldWithColor>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{data.map((d, dIndex) => (
										<TableRow hover key={uuid()}>
											<TableCell sx={{ maxWidth: '2px' }} align="center">
												{dIndex + 1}
											</TableCell>
											<TableCell>
												<b>{d.indicatorName}</b>{' '}
											</TableCell>
											<Tooltip arrow placement="right" title="Нажмите чтобы изменит">
												<TableCell
													sx={styles.editCellHoverStyles}
													onClick={() => handleDialogOpen(d, 'uzs')}
													align="center"
												>
													{formatNumber(d.uzs)}
												</TableCell>
											</Tooltip>
											<Tooltip arrow placement="right" title="Нажмите чтобы изменит">
												<TableCell
													sx={styles.editCellHoverStyles}
													onClick={() => handleDialogOpen(d, 'usd')}
													align="center"
												>
													{formatNumber(d.usd)}
												</TableCell>
											</Tooltip>
											<Tooltip arrow placement="right" title="Нажмите чтобы изменит">
												<TableCell
													sx={styles.editCellHoverStyles}
													onClick={() => handleDialogOpen(d, 'eur')}
													align="center"
												>
													{formatNumber(d.eur)}
												</TableCell>
											</Tooltip>
											<Tooltip arrow placement="right" title="Нажмите чтобы изменит">
												<TableCell
													sx={styles.editCellHoverStyles}
													onClick={() => handleDialogOpen(d, 'rub')}
													align="center"
												>
													{formatNumber(d.rub)}
												</TableCell>
											</Tooltip>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					))}
				</Grid>
				<Grid>
					<TableContainer sx={styles.tableContainer} component={Paper}>
						<Table size="small" aria-label="a dense table">
							<TableBody>
								<TableRow>
									<TableCell
										sx={{
											backgroundColor: palette.primary,
											color: 'white',
											fontSize: '54px',
											fontWeight: 'bold'
										}}
										rowSpan={3}
										align="center"
									>
										ВЛА
									</TableCell>
									<FormattedCell backgroundColor={palette.lightGray}>11%</FormattedCell>
									<FormattedCell backgroundColor={palette.lightBrown}>
										{formatNumber(vlaPercentValue * 0.11)}
									</FormattedCell>
								</TableRow>
								<TableRow>
									<FormattedCell backgroundColor={palette.lightGray}>Текущий</FormattedCell>
									<FormattedCell backgroundColor={palette.lightBrown}>{formatNumber(current)}</FormattedCell>
								</TableRow>
								<TableRow>
									<FormattedCell backgroundColor={palette.lightGray}>Разница</FormattedCell>
									<FormattedCell backgroundColor={palette.lightGreen}>{formatNumber(differ)}</FormattedCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
			</Grid>
			<Dialog open={Boolean(dialogData)} onClose={() => setDialogData(null)}>
				<DialogTitle>{dialogData?.indicatorType == 1 ? FlowTypes.inFlow : FlowTypes.outFlow}</DialogTitle>
				<form onSubmit={updateFlowData}>
					<DialogContent>
						<DialogContentText>{dialogData?.indicatorName}</DialogContentText>
						<TextField
							inputProps={{
								ref: dialogRef
							}}
							required
							autoFocus
							margin="dense"
							id="name"
							type="number"
							fullWidth
							variant="standard"
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setDialogData(null)}>Отмена</Button>
						<Button disabled={updateLoading} type="submit">
							{updateLoading ? <CircularProgress size={20} color="info" /> : 'Обновить'}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</Fragment>
	)
}

export default memo(VlaAndForTable)
