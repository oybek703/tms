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

function SimpleTableRow({ income }: { income: IVlaBufferRowData }) {
	return (
		<TableRow hover key={uuid()}>
			<TableCell>{income.indicatorName}</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{formatNumber(income.percentVlaTotal, 'e')}
			</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{formatNumber(income.percentTotal, 'e')}
			</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{formatNumber(income.saldoTotal, 'e')}
			</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{formatNumber(income.percentVlaUzs, 'e')}
			</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{formatNumber(income.percentUzs, 'e')}
			</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{formatNumber(income.saldoUzs, 'e')}
			</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{formatNumber(income.percentVlaUsd, 'e')}
			</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{formatNumber(income.percentUsd, 'e')}
			</TableCell>
			<TableCell align="center" sx={globalStyles.noWrap}>
				{formatNumber(income.saldoUsd, 'e')}
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
					<TableCap rows={10} text={'млн.'} />
					<TableHead sx={globalStyles.stickyTableHead}>
						<TableRow>
							<TableCell align="center">
								<BoldWithColor>ВЛА</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Доля в ВЛА общий(100%)</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Доля в активе ОБЩИЙ</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Итого</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Доля в ВЛА в нац. вал.</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Доля в совокупном активе в нац. валюте</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Национальная валюта</BoldWithColor>
							</TableCell>
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
						].map(item => (
							<Fragment key={uuid()}>
								{item.map(income => (
									<SimpleTableRow key={uuid()} income={income} />
								))}
							</Fragment>
						))}
						<SimpleTableRow income={highLiquidityAssets} />
					</TableBody>
				</Table>
			</TableContainer>
		</Fragment>
	)
}

export default memo(VLaBufferTable)
