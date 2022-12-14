import React, { useEffect, useState } from 'react'
import PageTitle from '../../components/layout/PageTitle'
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
import { IBankData } from '../../interfaces/corr-operations.interfaces'
import { LoaderWrapper } from '../../components/helpers/LoaderWrapper'

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
	},
	remainderBox: {
		mt: 2,
		display: 'flex',
		padding: 0,
		border: '1px solid #000',
		alignItems: 'center',
		paddingRight: '20px'
	},
	remainderButton: {
		textTransform: 'none',
		fontWeight: 'bold',
		backgroundColor: palette.primary,
		color: 'white !important',
		borderRadius: 0,
		marginRight: 3
	}
}

interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

interface ICardProps {
	titles: string[]
	mainTitle: string
	keys: (keyof IBankData)[]
	withIcon?: boolean
}

interface ITopBarProps {
	currencyCode: string
	useTwoDates: ReturnType<typeof useTwoDates>
	setCurrencyCode: React.Dispatch<React.SetStateAction<string>>
	bank: string | null
	setBank: React.Dispatch<React.SetStateAction<string | null>>
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props

	return (
		<div role="tabpanel" hidden={value !== index} {...other}>
			{value === index && <Box sx={{ p: '10px 0' }}>{children}</Box>}
		</div>
	)
}

function RenderTableHead({ titles }: Pick<ICardProps, 'titles'>) {
	return (
		<TableHead>
			<TableRow>
				{titles.map(value => (
					<TableCell sx={{ border: 'none', fontWeight: 'bold', color: 'rgba(51,51,51,0.51)' }} key={uuid()}>
						{value}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	)
}

function RenderTableBody({ keys, withIcon = false }: Pick<ICardProps, 'keys' | 'withIcon'>) {
	const {
		corrOperations: { bankData }
	} = useTypedSelector(state => state.corrOperations)
	return (
		<TableBody>
			<TableRow>
				{keys.map(key => (
					<TableCell sx={{ border: 'none' }} key={uuid()}>
						{withIcon ? bankData[key] && '✅' : bankData[key]}
					</TableCell>
				))}
			</TableRow>
		</TableBody>
	)
}

function InfoCard({ titles, mainTitle, keys, withIcon }: ICardProps) {
	return (
		<CardContent>
			<Typography sx={{ fontWeight: '600' }} variant="h5">
				{mainTitle}
			</Typography>
			<hr />
			<Table size="small">
				<RenderTableHead titles={titles} />
				<RenderTableBody withIcon={withIcon} keys={keys} />
			</Table>
		</CardContent>
	)
}

function TotalInfoTab() {
	return (
		<>
			<InfoCard
				titles={['Страна, город', 'Номер счета', 'SWIFT', 'Дата открытия']}
				mainTitle={'Информация'}
				keys={['country', 'clientCode', 'swiftCode', 'dateOpen']}
			/>
			<InfoCard
				titles={['Обьем операции', 'Скорость обслуживание', 'Качество обслуживание', 'Стоимость услуг(тарифы)']}
				mainTitle={'Обслуживание'}
				keys={['volumeOperations', 'serviceSpeed', 'serviceQuality', 'serviceCost']}
			/>
			<InfoCard
				withIcon
				titles={['Корр. счет', 'Ген. соглашения', 'ISDA', 'Прочие']}
				mainTitle={'Нал. соглашений'}
				keys={['conversionAccounts', 'genAgreement', 'isda', 'otherAgrement']}
			/>
			<InfoCard
				withIcon
				titles={[
					'Импорт оплаты',
					'Экспорт поступление',
					'Торг. фин',
					'МБД',
					'Кредитные линии',
					'Конверсионные операции',
					'Операции по востро',
					'Прочие'
				]}
				mainTitle={'Виды операций'}
				keys={[
					'imports',
					'exports',
					'tradingFin',
					'interbankDeposits',
					'creditLine',
					'conversionAccounts',
					'vostro',
					'otherOperations'
				]}
			/>
		</>
	)
}

function TopBar({
	bank,
	setBank,
	currencyCode,
	setCurrencyCode,
	useTwoDates: { firstDate, secondDate, handleDateChange }
}: ITopBarProps) {
	const { loading } = useTypedSelector(state => state.corrOperations)
	return (
		<Grid container sx={pageStyles.topBar} justifyContent="space-between" alignItems="center">
			<Button
				component={Grid}
				disabled={loading}
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
	)
}

function SideBar({ bank, setBank }: Pick<ITopBarProps, 'bank' | 'setBank'>) {
	const {
		corrOperations: { bankList }
	} = useTypedSelector(state => state.corrOperations)
	return (
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
		volume,
		fx,
		physicalPayments,
		legalPayments,
		interbankOperations,
		loroAccountsOperations,
		accredetivOperations,
		remainder
	} = corrOperations
	return (
		<>
			<PageTitle title="Дешбоард по корр. операциям" />
			<Paper sx={pageStyles.root}>
				<TopBar
					currencyCode={currencyCode}
					useTwoDates={{ firstDate, secondDate, handleDateChange }}
					setCurrencyCode={setCurrencyCode}
					bank={bank}
					setBank={setBank}
				/>
				<SideBar bank={bank} setBank={setBank} />
				<Grid sx={pageStyles.main}>
					{bank ? (
						<>
							<AppBar position="static" sx={globalStyles.blueBackground}>
								<Tabs
									sx={{ zIndex: 10000 }}
									TabIndicatorProps={{ sx: { height: '4px' } }}
									value={tab}
									onChange={(_, newValue) => setTab(newValue)}
								>
									<Tab label="Общая информация" />
									<Tab label="Показатели" />
									<Tab label="Контакты" />
								</Tabs>
							</AppBar>
							<LoaderWrapper loading={loading} error={error}>
								<TabPanel value={tab} index={0}>
									<TotalInfoTab />
								</TabPanel>
								<TabPanel value={tab} index={1}>
									<Box sx={pageStyles.remainderBox}>
										<Button disabled component="span" sx={pageStyles.remainderButton}>
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
									<Grid container spacing={2}>
										<Grid item xs={4}>
											<CorrOperationChart id="volume_by_bank" title="Обьем" data={volume} />
										</Grid>
										<Grid item xs={4}>
											<CorrOperationChart id="payments_count" title="Количество платежей" data={[]} />
										</Grid>
										<Grid item xs={4}>
											<CorrOperationChart id="fx_by_bank" title="Платежи по FX" data={fx} />
										</Grid>
										<Grid item xs={4}>
											<CorrOperationChart
												id="physicalPayments_by_bank"
												title="Платежи физ. лиц"
												data={physicalPayments}
											/>
										</Grid>
										<Grid item xs={4}>
											<CorrOperationChart id="legalPayments_by_bank" title="Платежи юр. лиц" data={legalPayments} />
										</Grid>
										<Grid item xs={4}>
											<CorrOperationChart
												id="interbankOperations_by_bank"
												title="Межбанковские операции"
												data={interbankOperations}
											/>
										</Grid>
									</Grid>
								</TabPanel>
								<TabPanel value={tab} index={2}>
									<InfoCard
										titles={['Имя', 'Номер телефона', 'Эл. почта', 'Сайт', 'Код дилинга']}
										mainTitle={'Контакты'}
										keys={[]}
									/>
								</TabPanel>
							</LoaderWrapper>
						</>
					) : (
						<LoaderWrapper loading={loading} error={error}>
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
						</LoaderWrapper>
					)}
				</Grid>
			</Paper>
		</>
	)
}

export default CorrOperations
