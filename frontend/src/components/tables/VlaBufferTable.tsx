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

interface IIncomeRowProps {
	income: IVlaBufferRowData
}

const styles: ISxStyles = {
	verticalCellGridStyles: {
		...globalStyles.verticalText,
		transform: 'rotate(0) translateY(-40px)',
		writingMode: 'vertical-rl',
		textOrientation: 'upright'
	},
	verticalCellStyles: {
		backgroundColor: palette.darkGray,
		border: '0'
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
	const rowSxStyles = { ...globalStyles.noWrap, color: bg ? palette.black : palette.red }
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

const VLaBufferTable = () => {
	const { vlaBuffer } = useTypedSelector(state => state.vlaBuffer)
	const { incomes, incomeBringing, nonProfits, nonProfitable, highLiquidityAssets } = vlaBuffer
	return (
		<Fragment>
			<TableContainer component={Paper}>
				<Table size="small" aria-label="a dense table">
					<TableCap rows={13} text={'млн.'} />
					<TableHead sx={globalStyles.stickyTableHead}>
						<TableRow>
							<TableCell align="center">
								<Typography sx={{ fontSize: 60, color: '#fff', fontWeight: 'bold' }}>ВЛА</Typography>
							</TableCell>
							<TableCell sx={styles.verticalCellStyles} />
							<TableCell align="center">
								<BoldWithColor>Доля в ВЛА общий(100%)</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Доля в активе ОБЩИЙ</BoldWithColor>
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
											bg={itemIndex === 0 ? palette.lightGreen : palette.primary}
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
		</Fragment>
	)
}

export default memo(VLaBufferTable)
