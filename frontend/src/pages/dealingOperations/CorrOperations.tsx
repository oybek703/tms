import React, { useEffect, useState } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import useTwoDates from '../../hooks/useTwoDates'
import {
	Button,
	FormControl,
	Grid,
	List,
	ListItem,
	ListItemText,
	ListSubheader,
	MenuItem,
	Paper,
	Select
} from '@mui/material'
import InlineDatePicker from '../../components/layout/Pickers/InlineDatePicker'
import { ISxStyles } from '../../interfaces/styles.interface'
import { v4 as uuid } from 'uuid'
import palette from '../../styles/palette'
import CorrOperationChart from '../../components/charts/dealingOperations/CorrOperationChart'

const pageStyles: ISxStyles = {
	root: {
		display: 'grid',
		padding: '20px 30px',
		gridTemplateColumns: 'minmax(150px, 300px) 1fr',
		gridTemplateRows: '1fr auto',
		gap: '10px',
		gridTemplateAreas: '"top-bar top-bar" "sidebar main"'
	},
	topBar: {
		gridArea: 'top-bar',
		marginBottom: '20px'
	},
	sideBar: {
		gridArea: 'sidebar',
		backgroundColor: '#eee',
		maxHeight: '65vh'
	},
	main: {
		gridArea: 'main',
		paddingTop: '20px',
		maxHeight: '65vh',
		overflowY: 'scroll'
	},
	sideBarBankList: {
		width: '100%',
		maxWidth: 'auto',
		maxHeight: '100%',
		overflow: 'auto',
		'& ul': { padding: 0 }
	},
	sideBarHeader: {
		textAlign: 'center',
		backgroundColor: palette.primary,
		color: 'white',
		fontWeight: 'bold'
	},
	sideBarBankItem: {
		padding: '5px',
		cursor: 'pointer',
		textTransform: 'uppercase',
		'&:hover': {
			backgroundColor: palette.primary,
			color: '#fff',
			fontWeight: 'bold'
		}
	}
}

const CorrOperations = () => {
	const { fetchCorrOperations } = useActions()
	const { corrOperations, loading, error } = useTypedSelector(state => state.corrOperations)
	const { firstDate, secondDate, handleDateChange } = useTwoDates()
	const [currencyCode, setCurrencyCode] = useState<string>('840')
	const [bank, setBank] = useState<string | null>(null)
	useEffect(() => {
		if (firstDate && secondDate && firstDate !== secondDate) {
			fetchCorrOperations({ firstDate, secondDate, currencyCode })
		}
	}, [fetchCorrOperations, secondDate, firstDate, currencyCode, bank])
	const {
		bankList,
		volume,
		fx,
		physicalPayments,
		legalPayments,
		interbankOperations,
		loroAccountsOperations,
		accredetivOperations
	} = corrOperations
	return (
		<>
			<PageTitle title="Дешбоард по корр. операциям" />
			<Paper sx={pageStyles.root}>
				<Grid container sx={pageStyles.topBar} justifyContent="space-between" alignItems="center">
					<Button
						component={Grid}
						onClick={() => setBank(null)}
						variant={bank === null ? 'contained' : 'outlined'}
						sx={{ textTransform: 'none' }}
					>
						По всем корр. счетам
					</Button>
					<Grid item>
						<Grid container alignItems="center">
							<InlineDatePicker
								disabled={loading}
								reportDate={firstDate}
								inputVariant="outlined"
								handleDateChange={handleDateChange('first_date')}
							/>
							&nbsp;&nbsp;
							<InlineDatePicker
								disabled={loading}
								reportDate={secondDate}
								inputVariant="outlined"
								handleDateChange={handleDateChange('second_date')}
							/>
							&nbsp;&nbsp;
							<span>млн.</span>
							&nbsp;&nbsp;
							<FormControl size="small">
								<Select
									disabled={loading}
									labelId="currency"
									id="currency"
									value={currencyCode}
									onChange={({ target: { value } }) => setCurrencyCode(value)}
								>
									<MenuItem value="840">USD</MenuItem>
									<MenuItem value="978">EUR</MenuItem>
									<MenuItem value="643">RUB</MenuItem>
								</Select>
							</FormControl>
						</Grid>
					</Grid>
				</Grid>
				<Grid sx={pageStyles.sideBar}>
					<List sx={pageStyles.sideBarBankList} subheader={<li />}>
						<li key={uuid()}>
							<ul>
								<ListSubheader sx={pageStyles.sideBarHeader}>По банку</ListSubheader>
								<>
									{bankList.map(({ bankName, clientCode }) => (
										<ListItem sx={{ padding: '2px 5px' }} key={uuid()} onClick={() => setBank(clientCode)}>
											<ListItemText
												primaryTypographyProps={{
													sx: {
														...pageStyles.sideBarBankItem,
														backgroundColor: bank === clientCode ? palette.lightGreen : 'transparent',
														color: bank === clientCode ? '#fff' : '#000',
														fontWeight: bank === clientCode ? 'bold' : '400'
													}
												}}
												primary={bankName}
											/>
										</ListItem>
									))}
								</>
							</ul>
						</li>
					</List>
				</Grid>
				<Grid sx={pageStyles.main}>
					{loading ? (
						<Loader />
					) : error ? (
						<Alert message={error} />
					) : (
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<CorrOperationChart id="volume" title="Обьем" data={volume} />
							</Grid>
							<Grid item xs={4}>
								<CorrOperationChart id="fx" title="FX транзакции" data={fx} />
							</Grid>
							<Grid item xs={4}>
								<CorrOperationChart id="physicalPayments" title="Платежи физ. лиц" data={physicalPayments} />
							</Grid>
							<Grid item xs={4}>
								<CorrOperationChart id="legalPayments" title="Платежи юр. лиц" data={legalPayments} />
							</Grid>
							<Grid item xs={4}>
								<CorrOperationChart
									id="interbankOperations"
									title="Межбанковские операции"
									data={interbankOperations}
								/>
							</Grid>
							<Grid item xs={4}>
								<CorrOperationChart
									id="loroAccountsOperations"
									title="Операции по лоро счётам"
									data={loroAccountsOperations}
								/>
							</Grid>
							<Grid item xs={4}>
								<CorrOperationChart
									id="accredetivOperations"
									title="Операции по аккредитивам"
									data={accredetivOperations}
								/>
							</Grid>
						</Grid>
					)}
				</Grid>
			</Paper>
		</>
	)
}

export default CorrOperations
