import React, { Fragment, memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import Paper from '@mui/material/Paper'
import TableCap from '../UI/helpers/TableCap'
import { TableRow, Typography } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { v4 as uuid } from 'uuid'
import { formatNumber } from '../../utils'
import Grid from '@mui/material/Grid'
import LongArrowDown from '../../images/long-arrow-down.png'
import globalStyles from '../../styles/globalStyles'

const styles = {
	borderRadius: {
		border: '1.5px solid #ffffff',
		borderRadius: '10px',
		backgroundColor: '#ffffff',
		boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
		borderTopLeftRadius: '4px',
		borderTopRightRadius: '4px',
		borderBottomLeftRadius: '4px',
		borderBottomRightRadius: '4px',
		paddingTop: '4px',
		margin: '0',
		paddingBottom: '4px',
		marginBottom: '10px'
	},
	redBoldText: {
		color: '#009c34',
		fontWeight: 600
	},
	moreRedText: {
		color: 'rgb(192, 0, 0)',
		fontSize: '17px'
	},
	lightRed: {
		color: '#009c34'
	},
	black: {
		color: 'rgb(102, 102, 102)'
	},
	resourceBase: {
		border: '3px dashed rgb(255, 0, 0)',
		marginLeft: '0',
		marginRight: '0',
		borderRadius: '10px',
		color: 'rgb(192, 0, 0)',
		padding: '10px 10px 20px 10px',
		maxWidth: '99%',
		margin: '0 auto',
		fontWeight: 600,
		whiteSpace: 'nowrap'
	},
	balanceActive: {
		padding: '10px 10px',
		margin: '0 auto'
	},
	fundingAvg: {
		padding: '10px'
	},
	titleText: {
		fontSize: '20px'
	},
	titleNumber: {
		fontSize: '26px',
		fontWeight: 600
	},
	blackText: {
		fontSize: '18px'
	},
	setPadding: {
		paddingLeft: 0,
		border: 'none'
	},
	wrapper: {
		backgroundColor: '#EBF5FF',
		border: 'none',
		boxShadow: 'none'
	}
}

function NoBorderCell(props: any) {
	const {
		children,
		nowrap = false,
		redbold = false,
		titletext = false,
		morered = false,
		titlenumber = false,
		blacktext = false
	} = props
	return (
		<TableCell
			sx={{
				...globalStyles.noBorder,
				...(nowrap && globalStyles.noWrap),
				...(redbold && { color: '#009c34', fontWeight: 600 }),
				...(titletext && { fontSize: '20px' }),
				...(titlenumber && { fontSize: '26px', fontWeight: 600 }),
				...(morered && { color: 'rgb(192, 0, 0)', fontSize: '17px' }),
				...(blacktext && { fontSize: '18px' })
			}}
			align="center"
			{...props}
		>
			{children}
		</TableCell>
	)
}

function RedLightText(props: any) {
	const { children } = props
	return (
		<Typography component="b" sx={{ color: '#009c34', fontWeight: 600 }} {...props}>
			{children}
		</Typography>
	)
}

interface FcrbTableProps {
	rows: any
}

const FcrbTable: React.FC<FcrbTableProps> = ({ rows = {} }) => {
	const {
		mfiData = {},
		treasuryData = {},
		retailData = {},
		centralizedResourceBaseData = {},
		portfolioData = {}
	} = rows
	return (
		<Paper sx={{ backgroundColor: '#EBF5FF', border: 'none', boxShadow: 'none' }}>
			<Table size="small" stickyHeader>
				<TableCap rows={20} text={'млрд.сум'} />
			</Table>
			{/* МФИ, КАЗНАЧЕЙСТВО(деп. юр. лиц меж.банк), РОЗНИЦА(депозиты физ.лиц) */}
			<Grid container sx={globalStyles.smallCardGrid}>
				<Grid>
					<Table sx={styles.borderRadius} size="small">
						<TableHead>
							<TableRow>
								<NoBorderCell titletext="true" colSpan={6} align="center">
									<b>МФИ</b>
								</NoBorderCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<NoBorderCell colSpan={6} redbold="true" titlenumber="true" align="center">
									<>
										{formatNumber(
											// mfiData['mfiTotal']
											26238.5
										)}
									</>
								</NoBorderCell>
							</TableRow>
							<TableRow>
								{['USD', 'EUR', 'UZS'].map((t, i) => (
									<Fragment key={uuid()}>
										<NoBorderCell
											colSpan={2}
											morered="true"
											align={t === 'USD' ? 'right' : t === 'UZS' ? 'left' : 'center'}
										>
											<b>
												{t} &nbsp;{' '}
												<RedLightText>
													{formatNumber(
														((mfiData['mfiPercents'] || []).find((percent: any) => percent['CURRENCY_NAME'] === t) ||
															{})['PERCENT']
													)}
													%
												</RedLightText>
											</b>
										</NoBorderCell>
									</Fragment>
								))}
							</TableRow>
						</TableBody>
					</Table>
				</Grid>
				<Grid>
					<Table sx={styles.borderRadius} size="small">
						<TableHead>
							<TableRow>
								<NoBorderCell titletext="true" colSpan={6} align="center">
									<b>КАЗНАЧЕЙСТВО (деп. юр. лиц меж.банк)</b>
								</NoBorderCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<NoBorderCell colSpan={6} redbold="true" titlenumber="true">
									<b>
										{formatNumber(
											// treasuryData['treasuryTotal']
											13426.3
										)}
									</b>
								</NoBorderCell>
							</TableRow>
							<TableRow>
								{['USD', 'EUR', 'UZS'].map((t, i) => (
									<Fragment key={uuid()}>
										<NoBorderCell
											colSpan={2}
											morered="true"
											align={t === 'USD' ? 'right' : t === 'UZS' ? 'left' : 'center'}
										>
											<b>
												{t} &nbsp;{' '}
												<RedLightText>
													{formatNumber(
														((treasuryData['treasuryPercents'] || []).find(
															(percent: any) => percent['CURRENCY_NAME'] === t
														) || {})['PERCENT']
													)}
													%
												</RedLightText>
											</b>
										</NoBorderCell>
									</Fragment>
								))}
							</TableRow>
						</TableBody>
					</Table>
				</Grid>
				<Grid>
					<Table sx={styles.borderRadius} size="small">
						<TableHead>
							<TableRow>
								<NoBorderCell titletext="true" colSpan={6} align="center">
									<b>РОЗНИЦА (депозиты физ.лиц)</b>
								</NoBorderCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<NoBorderCell colSpan={6} redbold="true" titlenumber="true" align="center">
									<b>
										{formatNumber(
											// retailData['retailTotal']
											2488.8
										)}
									</b>
								</NoBorderCell>
							</TableRow>
							<TableRow>
								{['USD', 'EUR', 'UZS'].map((t, i) => (
									<Fragment key={uuid()}>
										<NoBorderCell
											colSpan={2}
											morered="true"
											align={t === 'USD' ? 'right' : t === 'UZS' ? 'left' : 'center'}
										>
											<b>
												{t} &nbsp;{' '}
												<RedLightText>
													{formatNumber(
														((retailData['retailPercents'] || []).find(
															(percent: any) => percent['CURRENCY_NAME'] === t
														) || {})['PERCENT']
													)}
													%
												</RedLightText>
											</b>
										</NoBorderCell>
									</Fragment>
								))}
							</TableRow>
						</TableBody>
					</Table>
				</Grid>
			</Grid>
			<Grid container sx={globalStyles.smallCard}>
				{Array(3)
					.fill('')
					.map(_ => (
						<Grid key={uuid()} sx={globalStyles.smallCard} item xs={4}>
							<ArrowDownwardIcon />
						</Grid>
					))}
			</Grid>
			{/* ЦЕНТРАЛИЗОВАННАЯ РЕСУРСНАЯ БАЗА */}
			<Grid container justifyContent="center" sx={styles.resourceBase}>
				<Grid item sx={globalStyles.smallCard}>
					<Typography gutterBottom variant="h5" sx={{ color: 'rgb(102, 102, 102)', fontWeight: 600 }}>
						ЦЕНТРАЛИЗОВАННАЯ РЕСУРСНАЯ БАЗА
					</Typography>
				</Grid>
				<Grid container spacing={2}>
					<Grid item xs={4}>
						<Table sx={styles.borderRadius} size="small">
							<TableHead>
								<TableRow>
									<NoBorderCell titlenumber="true" colSpan={3} align="right">
										<b>КАПИТАЛ</b>
									</NoBorderCell>
									<NoBorderCell redbold="true" titlenumber="true" colSpan={2} align="left">
										<b>
											{formatNumber(
												// centralizedResourceBaseData['capital']
												6476.9
											)}
										</b>
									</NoBorderCell>
								</TableRow>
							</TableHead>
						</Table>
					</Grid>
					<Grid item xs={8}>
						<Table sx={styles.borderRadius} size="small">
							<TableHead>
								<TableRow>
									<NoBorderCell titlenumber="true" colSpan={4} align="right">
										<b>ОБЯЗАТЕЛЬСТВА</b>
									</NoBorderCell>
									<NoBorderCell titlenumber="true" redbold="true" colSpan={2} align="left">
										<b>
											{formatNumber(
												// centralizedResourceBaseData['obligations']
												42153.6
											)}
										</b>
									</NoBorderCell>
								</TableRow>
							</TableHead>
						</Table>
					</Grid>
				</Grid>
			</Grid>
			{/* другие активы, инвестиции, цен. бумаги и меж. банк., кредитования + аккредитив, розничное кредитования */}
			<br />
			<TableContainer>
				<Table size="small">
					<TableBody>
						{/* другие активы, инвестиции, цен. бумаги и меж. банк., кредитования + аккредитив, розничное кредитования */}
						<TableRow>
							<NoBorderCell colSpan={3} sx={styles.setPadding} align="center">
								<Table sx={styles.borderRadius} size="small">
									<TableHead>
										<TableRow>
											<NoBorderCell nowrap="true" blacktext="true" align="center">
												<b>другие активы</b>
											</NoBorderCell>
											<NoBorderCell redbold="true" nowrap="true" morered="true" align="left">
												<RedLightText>
													{formatNumber(
														// portfolioData['otherActives'])
														8793.7
													)}
												</RedLightText>
											</NoBorderCell>
										</TableRow>
									</TableHead>
								</Table>
							</NoBorderCell>
							<NoBorderCell rowSpan={3} />
							<NoBorderCell colSpan={3} align="center">
								<Table sx={styles.borderRadius} size="small">
									<TableHead>
										<TableRow>
											<NoBorderCell colSpan={2} nowrap="true" blacktext="true" align="center">
												<b>инвестиции</b>
											</NoBorderCell>
											<NoBorderCell redbold="true" morered="true" colSpan={3} align="left">
												<RedLightText>
													{formatNumber(
														// portfolioData['investments']
														745.7
													)}
												</RedLightText>
											</NoBorderCell>
										</TableRow>
									</TableHead>
								</Table>
							</NoBorderCell>
							<NoBorderCell rowSpan={2} />
							<NoBorderCell colSpan={3} align="center">
								<Table sx={styles.borderRadius} size="small">
									<TableHead>
										<TableRow>
											<NoBorderCell nowrap="true" blacktext="true" colSpan={3} align="center">
												<b>цен. бум. и меж. банк.</b>
											</NoBorderCell>
											<NoBorderCell redbold="true" morered="true" colSpan={3} nowrap="true" align="left">
												<RedLightText>
													{formatNumber(
														// portfolioData['billsAndInterbankDeposits']
														3449.2
													)}
												</RedLightText>
											</NoBorderCell>
										</TableRow>
									</TableHead>
								</Table>
							</NoBorderCell>
							<NoBorderCell colSpan={4} align="center">
								<Table sx={styles.borderRadius} size="small">
									<TableHead>
										<TableRow>
											<NoBorderCell
												sx={{
													...styles.setPadding,
													...styles.blackText
												}}
												nowrap="true"
												colSpan={3}
												align="center"
											>
												<b>кредитования + аккредитив</b>
											</NoBorderCell>
											<NoBorderCell redbold="true" morered="true" nowrap="true" colSpan={3} align="left">
												<RedLightText>
													{formatNumber(
														// portfolioData['creditingAndAccredetiv']
														30843.3
													)}
												</RedLightText>
											</NoBorderCell>
										</TableRow>
									</TableHead>
								</Table>
							</NoBorderCell>
							<NoBorderCell colSpan={2} align="center">
								<Table sx={styles.borderRadius} size="small">
									<TableHead>
										<TableRow>
											<NoBorderCell nowrap="true" colSpan={3} align="center" blacktext="true">
												<b>розничное кредитования</b>
											</NoBorderCell>
											<NoBorderCell redbold="true" morered="true" nowrap="true" colSpan={3} align="left">
												<RedLightText>
													{formatNumber(
														// portfolioData['retailLending']
														4798.6
													)}
												</RedLightText>
											</NoBorderCell>
										</TableRow>
									</TableHead>
								</Table>
							</NoBorderCell>
						</TableRow>
						{/* ARROWS PART */}
						<TableRow>
							<NoBorderCell align="center" colSpan={3} rowSpan={3}>
								<Grid component="img" sx={{ paddingTop: 'px' }} src={LongArrowDown} alt="pointer arrow" />
							</NoBorderCell>
							<NoBorderCell colSpan={3} align="center">
								<ArrowDownwardIcon />
							</NoBorderCell>
							<NoBorderCell colSpan={3} align="center">
								<ArrowDownwardIcon />
							</NoBorderCell>
							<NoBorderCell align="center" colSpan={4} rowSpan={3}>
								<Grid component="img" sx={{ paddingTop: 'px' }} src={LongArrowDown} alt="pointer arrow" />
							</NoBorderCell>
							<NoBorderCell align="center" colSpan={3} rowSpan={3}>
								<Grid component="img" sx={{ paddingTop: 'px' }} src={LongArrowDown} alt="pointer arrow" />
							</NoBorderCell>
						</TableRow>
						{/* КАЗНАЧЕЙСКИЙ ПОРТФЕЛЬ */}
						<TableRow>
							<NoBorderCell colSpan={7} align="center">
								<Table sx={styles.borderRadius} size="small">
									<TableHead>
										<TableRow>
											<NoBorderCell colSpan={6} align="center" titlenumber="true">
												<b>
													КАЗНАЧЕЙСКИЙ ПОРТФЕЛЬ
													<NoBorderCell component="span" titlenumber="true" redbold="true">
														&nbsp;{' '}
														<b>
															{formatNumber(
																// portfolioData['treasuryPortfolio']
																4194.9
															)}
														</b>
													</NoBorderCell>
												</b>
											</NoBorderCell>
										</TableRow>
									</TableHead>
								</Table>
							</NoBorderCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			{/* БАЛАНСОВЫЕ АКТИВЫ */}
			<br />
			<Grid
				container
				sx={{ ...globalStyles.smallCardContainer, ...styles.balanceActive, ...styles.setPadding }}
				justifyContent="center"
			>
				<Grid item xs={12}>
					<Table sx={styles.borderRadius} size="small">
						<TableHead>
							<TableRow>
								<NoBorderCell titlenumber="true" nowrap="true" colSpan={6} align="center" titletext="true">
									<b>
										БАЛАНСОВЫЕ АКТИВЫ
										<NoBorderCell component="span" titlenumber="true" redbold="true">
											&nbsp;
											<b>
												{formatNumber(
													// portfolioData['balanceActive']
													48630.5
												)}
											</b>
										</NoBorderCell>
									</b>
								</NoBorderCell>
							</TableRow>
						</TableHead>
					</Table>
				</Grid>
			</Grid>
			<br />
			{/** Средняя ставка всего фондирования*/}
			<Grid container sx={{ ...globalStyles.smallCardContainer, ...styles.fundingAvg }} justifyContent="space-evenly">
				<Grid item xs={6}>
					<Table sx={styles.borderRadius} size="small">
						<TableHead>
							<TableRow>
								<NoBorderCell blacktext="true" nowrap="true" align="left">
									<b>*Средняя ставка всего фондирования</b>
								</NoBorderCell>
								{['USD', 'EUR', 'UZS'].map(t => (
									<Fragment key={uuid()}>
										<NoBorderCell align="center" morered="true">
											<b>{t}</b>
										</NoBorderCell>
										<NoBorderCell redbold="true" morered="true" align="center">
											<RedLightText>
												{formatNumber(
													((portfolioData['fundingAvgRatePercents'] || []).find(
														(percent: any) => percent['CURRENCY_NAME'] === t
													) || {})['PERCENT']
												)}
												%
											</RedLightText>
										</NoBorderCell>
									</Fragment>
								))}
							</TableRow>
						</TableHead>
					</Table>
				</Grid>
			</Grid>
		</Paper>
	)
}

export default memo(FcrbTable)
