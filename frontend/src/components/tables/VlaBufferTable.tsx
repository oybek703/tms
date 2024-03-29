import React, { Fragment, memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { formatNumber } from '../../utils'
import BoldWithColor from '../helpers/BoldWithColor'
import useTypedSelector from '../../hooks/useTypedSelector'
import { v4 as uuid } from 'uuid'
import TableCap from '../helpers/TableCap'
import globalStyles from '../../styles/globalStyles'
import { IVlaBufferRowData } from '../../interfaces/vlaBuffer.interfaces'
import { Grid, Typography } from '@mui/material'
import palette from '../../styles/palette'
import { ISxStyles } from '../../interfaces/styles.interface'
import VlaBufferChart from '../charts/vlaBuffer/VlaBufferChart'

interface IIncomeRowProps {
	income: IVlaBufferRowData
}

const styles: ISxStyles = {
	tableContainer: {
		padding: 0,
		marginBottom: '20px'
	},
	verticalCellGridStyles: {
		...globalStyles.verticalText,
		transform: 'rotate(0) translateY(-40px)',
		writingMode: 'vertical-rl',
		textOrientation: 'upright'
	},
	verticalCellStyles: {
		backgroundColor: palette.primary,
		border: '0',
		color: '#fff'
	},
	titleTextStyles: {
		fontSize: 60,
		color: '#fff',
		fontWeight: 'bold'
	},
	bottomContainer: {
		display: 'grid',
		gridAutoFlow: 'column',
		gridTemplateColumns: 'minmax(1fr, auto)'
	},
	chartsContainer: {
		display: 'grid',
		gridAutoFlow: 'column',
		gridTemplateColumns: 'repeat(3, 1fr)'
	}
}

function VerticalCell({ text = 'ALL' }: { text?: string }) {
	return (
		<TableCell rowSpan={0} sx={styles.verticalCellStyles}>
			<Grid sx={styles.verticalCellGridStyles}>{text}</Grid>
		</TableCell>
	)
}

function SimpleTableRow({ income }: IIncomeRowProps) {
	return (
		<TableRow hover>
			<TableCell>{income.indicatorName}</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{income.percentVlaTotal ? formatNumber(income.percentVlaTotal) + '%' : ''}
			</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{income.percentTotal ? formatNumber(income.percentTotal) + '%' : ''}
			</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{formatNumber(income.saldoTotal, 'e')}
			</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{income.percentVlaUzs ? formatNumber(income.percentVlaUzs) + '%' : ''}
			</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{income.percentUzs ? formatNumber(income.percentUzs) + '%' : ''}
			</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{formatNumber(income.saldoUzs, 'e')}
			</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{income.percentVlaUsd ? formatNumber(income.percentVlaUsd) + '%' : ''}
			</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{income.percentUsd ? formatNumber(income.percentUsd) + '%' : ''}
			</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{formatNumber(income.saldoUsd, 'e')}
			</TableCell>
		</TableRow>
	)
}

function HeadTableRow({ income, bg, allSpan }: IIncomeRowProps & { bg?: string; allSpan?: boolean }) {
	const rowSxStyles = {
		...globalStyles.noWrap,
		color: bg ? '#fff' : palette.red
	}
	return (
		<TableRow sx={{ backgroundColor: bg }}>
			<TableCell align={bg ? 'center' : 'left'} sx={rowSxStyles}>
				<b>{income.indicatorName}</b>
			</TableCell>
			{allSpan && <VerticalCell />}
			<TableCell sx={rowSxStyles} align="center">
				<b>{formatNumber(income.percentVlaTotal)}%</b>
			</TableCell>
			<TableCell sx={rowSxStyles} align="center">
				<b>{formatNumber(income.percentTotal)}%</b>
			</TableCell>
			<TableCell sx={rowSxStyles} align="center">
				<b>{formatNumber(income.saldoTotal)}</b>
			</TableCell>
			{allSpan && <VerticalCell text="UZS" />}
			<TableCell sx={rowSxStyles} align="center">
				<b>{formatNumber(income.percentVlaUzs)}%</b>
			</TableCell>
			<TableCell sx={rowSxStyles} align="center">
				<b>{formatNumber(income.percentUzs)}%</b>
			</TableCell>
			<TableCell sx={rowSxStyles} align="center">
				<b>{formatNumber(income.saldoUzs)}</b>
			</TableCell>
			{allSpan && <VerticalCell text="USD" />}
			<TableCell sx={rowSxStyles} align="center">
				<b>{formatNumber(income.percentVlaUsd)}%</b>
			</TableCell>
			<TableCell sx={rowSxStyles} align="center">
				<b>{formatNumber(income.percentUsd)}%</b>
			</TableCell>
			<TableCell sx={rowSxStyles} align="center">
				<b>{formatNumber(income.saldoUsd)}</b>
			</TableCell>
		</TableRow>
	)
}

const VlaBufferTable = () => {
	const { vlaBuffer } = useTypedSelector(state => state.vlaBuffer)
	const { incomes, incomeBringing, nonProfits, nonProfitable, highLiquidityAssets } = vlaBuffer
	const allPercents = [nonProfitable.percentTotal, incomeBringing.percentTotal]
	const uzsPercents = [nonProfitable.percentUzs, incomeBringing.percentUzs]
	const usdPercents = [nonProfitable.percentUsd, incomeBringing.percentUsd]
	return (
		<Fragment>
			<TableContainer sx={styles.tableContainer} component={Paper}>
				<Table size="small" aria-label="a dense table">
					<TableCap rows={13} text={'млн.'} />
					<TableHead sx={globalStyles.stickyTableHead}>
						<TableRow>
							<TableCell align="center">
								<Typography sx={styles.titleTextStyles}>ВЛА</Typography>
							</TableCell>
							<TableCell sx={styles.verticalCellStyles} />
							<TableCell align="center">
								<BoldWithColor>Доля в ВЛА (100%)</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Доля в совокупном активе</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Итого</BoldWithColor>
							</TableCell>
							<TableCell sx={styles.verticalCellStyles} />
							<TableCell align="center">
								<BoldWithColor>Доля в ВЛА в нац. вал.</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Доля в совокупном активе в нац. валюте</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Национальная валюта</BoldWithColor>
							</TableCell>
							<TableCell sx={styles.verticalCellStyles} />
							<TableCell align="center">
								<BoldWithColor>Доля в ВЛА в ин. вал.</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Доля в совокупном активе в ин. валюте</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Иностранном валюте(долл.США)</BoldWithColor>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{[
							[incomeBringing, ...incomes],
							[nonProfitable, ...nonProfits]
						].map((item, itemIndex) => (
							<Fragment key={uuid()}>
								{item.map((income, incomeIndex) =>
									incomeIndex === 0 ? (
										<HeadTableRow
											allSpan={itemIndex === 0 && incomeIndex === 0}
											bg={itemIndex === 0 ? palette.lightGreen : palette.red}
											income={income}
											key={uuid()}
										/>
									) : (
										<SimpleTableRow key={uuid()} income={income} />
									)
								)}
							</Fragment>
						))}
						<HeadTableRow income={highLiquidityAssets} />
					</TableBody>
				</Table>
			</TableContainer>
			<Grid component={Paper} sx={styles.bottomContainer}>
				<Grid sx={{ display: 'flex', flexDirection: 'column' }}>
					<Typography
						align="center"
						sx={{
							...styles.titleTextStyles,
							backgroundColor: palette.lightGreen,
							marginTop: '50px',
							padding: '20px 20px',
							fontSize: 20,
							maxWidth: '280px'
						}}
					>
						Доходоприносящие высоколиквидные активы
					</Typography>
					<Typography
						align="center"
						sx={{
							...styles.titleTextStyles,
							backgroundColor: palette.red,
							padding: '20px 20px',
							marginTop: '40px',
							fontSize: 20,
							maxWidth: '280px'
						}}
					>
						Доходонеприносящие высоколиквидные активы
					</Typography>
				</Grid>
				<Grid sx={styles.chartsContainer}>
					<VlaBufferChart series={allPercents} labelText="ALL" />
					<VlaBufferChart series={uzsPercents} labelText="UZS" />
					<VlaBufferChart series={usdPercents} labelText="USD" />
				</Grid>
			</Grid>
		</Fragment>
	)
}

export default memo(VlaBufferTable)
