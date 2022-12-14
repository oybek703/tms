import React, { Fragment, useEffect, useState } from 'react'
import PageTitle from '../../components/layout/PageTitle'
import Loader from '../../components/layout/Loader'
import Alert from '../../components/layout/Alert'
import useTypedSelector from '../../hooks/useTypedSelector'
import useActions from '../../hooks/useActions'
import useTwoDates from '../../hooks/useTwoDates'
import {
	AppBar,
	Box,
	Button,
	CardContent,
	FormControl,
	Grid,
	List,
	ListItem,
	ListItemText,
	ListSubheader,
	MenuItem,
	Paper,
	Select,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Tabs,
	Typography
} from '@mui/material'
import InlineDatePicker from '../../components/layout/Pickers/InlineDatePicker'
import { ISxStyles } from '../../interfaces/styles.interface'
import { v4 as uuid } from 'uuid'
import palette from '../../styles/palette'
import CorrOperationChart from '../../components/charts/dealingOperations/CorrOperationChart'
import globalStyles from '../../styles/globalStyles'
import { formatNumber } from '../../utils'
import { format } from 'date-fns'

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

interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props

	return (
		<div role="tabpanel" hidden={value !== index} {...other}>
			{value === index && <Box sx={{ p: '10px 0' }}>{children}</Box>}
		</div>
	)
}

const CorrOperations = () => {
	const { fetchCorrOperations } = useActions()
	const { corrOperations, loading, error } = useTypedSelector(state => state.corrOperations)
	const { firstDate, secondDate, handleDateChange } = useTwoDates()
	const [currencyCode, setCurrencyCode] = useState<string>('840')
	const [bank, setBank] = useState<string | null>(null)
	const [tab, setTab] = React.useState(0)

	useEffect(() => {
		if (firstDate && secondDate && firstDate !== secondDate) {
			fetchCorrOperations({ firstDate, secondDate, currencyCode, clientCode: bank })
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
		accredetivOperations,
		remainder,
		bankData
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
												title={clientCode}
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
						<Fragment>
							{bank ? (
								<Fragment>
									<AppBar position="static" sx={globalStyles.blueBackground}>
										<Tabs
											TabIndicatorProps={{ sx: { height: '4px' } }}
											value={tab}
											onChange={(_, newValue) => setTab(newValue)}
										>
											<Tab label="Общая информация" />
											<Tab label="Показатели" />
											<Tab label="Контакты" />
										</Tabs>
									</AppBar>
									<TabPanel value={tab} index={0}>
										<CardContent>
											<Typography sx={{ fontWeight: '600' }} variant="h5">
												Информация
											</Typography>
											<hr />
											<Table size="small">
												<TableHead>
													<TableRow>
														{['Страна, город', 'Номер счета', 'SWIFT', 'Дата открытия'].map(value => (
															<TableCell sx={{ border: 'none' }} key={uuid()}>
																{value}
															</TableCell>
														))}
													</TableRow>
												</TableHead>
												<TableBody>
													<TableRow>
														<TableCell sx={{ border: 'none' }}>{bankData.country}</TableCell>
														<TableCell sx={{ border: 'none' }}>{bankData.clientCode || bank}</TableCell>
														<TableCell sx={{ border: 'none' }}>{bankData.swiftCode}</TableCell>
														<TableCell sx={{ border: 'none' }}>{bankData.dateOpen}</TableCell>
													</TableRow>
												</TableBody>
											</Table>
										</CardContent>
										<CardContent>
											<Typography sx={{ fontWeight: '600' }} variant="h5">
												Обслуживание
											</Typography>
											<hr />
											<Table size="small">
												<TableHead>
													<TableRow>
														{[
															'Обьем операции',
															'Скорость обслуживание',
															'Качество обслуживание',
															'Стоимость услуг(тарифы)'
														].map(value => (
															<TableCell sx={{ border: 'none' }} key={uuid()}>
																{value}
															</TableCell>
														))}
													</TableRow>
												</TableHead>
												<TableBody>
													<TableRow>
														<TableCell sx={{ border: 'none' }}>{bankData.volumeOperations}</TableCell>
														<TableCell sx={{ border: 'none' }}>{bankData.serviceSpeed}</TableCell>
														<TableCell sx={{ border: 'none' }}>{bankData.serviceQuality}</TableCell>
														<TableCell sx={{ border: 'none' }}>{bankData.serviceCost}</TableCell>
													</TableRow>
												</TableBody>
											</Table>
										</CardContent>
										<CardContent>
											<Typography sx={{ fontWeight: '600' }} variant="h5">
												Нал. соглашений
											</Typography>
											<hr />
											<Table size="small">
												<TableHead>
													<TableRow>
														{['Корр. счет', 'Ген. соглашения', 'ISDA', 'Прочие'].map(value => (
															<TableCell sx={{ border: 'none' }} key={uuid()}>
																{value}
															</TableCell>
														))}
													</TableRow>
												</TableHead>
												<TableBody>
													<TableRow>
														<TableCell sx={{ border: 'none' }}>{bankData.corrAccounts && '✅'}</TableCell>
														<TableCell sx={{ border: 'none' }}>{bankData.genAgreement && '✅'}</TableCell>
														<TableCell sx={{ border: 'none' }}>{bankData.isda && '✅'}</TableCell>
														<TableCell sx={{ border: 'none' }}>{bankData.otherAgrement && '✅'}</TableCell>
													</TableRow>
												</TableBody>
											</Table>
										</CardContent>
										<CardContent>
											<Typography sx={{ fontWeight: '600' }} variant="h5">
												Виды операций
											</Typography>
											<hr />
											<Table size="small">
												<TableHead>
													<TableRow>
														{[
															'Импорт оплаты',
															'Экспорт поступление',
															'Торг. фин',
															'МБД',
															'Кредитные линии',
															'Конверсионные операции',
															'Операции по востро',
															'Прочие'
														].map(value => (
															<TableCell sx={{ border: 'none' }} key={uuid()}>
																{value}
															</TableCell>
														))}
													</TableRow>
												</TableHead>
												<TableBody>
													<TableRow>
														<TableCell sx={{ border: 'none' }}>{bankData.imports && '✅'}</TableCell>
														<TableCell sx={{ border: 'none' }}>{bankData.exports && '✅'}</TableCell>
														<TableCell sx={{ border: 'none' }}>{bankData.tradingFin && '✅'}</TableCell>
														<TableCell sx={{ border: 'none' }}>{bankData.interbankDeposits && '✅'}</TableCell>
														<TableCell sx={{ border: 'none' }}>{bankData.creditLine && '✅'}</TableCell>
														<TableCell sx={{ border: 'none' }}>{bankData.conversionAccounts && '✅'}</TableCell>
														<TableCell sx={{ border: 'none' }}>{bankData.vostro && '✅'}</TableCell>
														<TableCell sx={{ border: 'none' }}>{bankData.otherOperations && '✅'}</TableCell>
													</TableRow>
												</TableBody>
											</Table>
										</CardContent>
									</TabPanel>
									<TabPanel value={tab} index={1}>
										<Box
											sx={{
												display: 'flex',
												padding: 0,
												border: '1px solid #000',
												alignItems: 'center',
												paddingRight: '20px'
											}}
										>
											<Button
												disabled
												component="span"
												sx={{
													textTransform: 'none',
													fontWeight: 'bold',
													backgroundColor: palette.primary,
													color: 'white !important',
													borderRadius: 0,
													marginRight: 3
												}}
											>
												Остатки на {format(new Date(secondDate), 'dd.MM.yyyy')}
											</Button>
											{remainder.map(({ saldoOut, currencyName }, index, array) => (
												<Typography key={uuid()}>
													<Typography component="b" sx={{ fontWeight: 'bold' }}>
														{currencyName} -{' '}
													</Typography>
													<Typography component="span" sx={{ marginRight: 2 }}>
														{formatNumber(saldoOut)} ном. {index !== array.length - 1 && '|'}
													</Typography>
												</Typography>
											))}
										</Box>
									</TabPanel>
									<TabPanel value={tab} index={2}>
										<CardContent>
											<Typography sx={{ fontWeight: '600' }} variant="h5">
												Контакты
											</Typography>
											<hr />
											<Table size="small">
												<TableHead>
													<TableRow>
														{['Имя', 'Номер телефона', 'Эл. почта', 'Сайт', 'Код дилинга'].map(value => (
															<TableCell sx={{ border: 'none' }} key={uuid()}>
																{value}
															</TableCell>
														))}
													</TableRow>
												</TableHead>
												<TableBody></TableBody>
											</Table>
										</CardContent>
									</TabPanel>
								</Fragment>
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
						</Fragment>
					)}
				</Grid>
			</Paper>
		</>
	)
}

export default CorrOperations
