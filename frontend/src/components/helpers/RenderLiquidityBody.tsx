import React, { Fragment, useCallback } from 'react'
import TableBody from '@mui/material/TableBody'
import { v4 as uuid } from 'uuid'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import globalStyles from '../../styles/globalStyles'
import { formatNumber } from '../../utils'
import { singleColouredRow } from '../tables/LiqPointersTable'
import { ILiquidityRow } from '../../interfaces/liquidity.interfaces'

const RenderLiquidityBody = ({ tableData }: { tableData: ILiquidityRow[] }) => {
	const renderTableBody = useCallback(
		(tableData: ILiquidityRow[]) => (
			<TableBody>
				{tableData.map((row, i: number) => (
					<Fragment key={uuid()}>
						{row.indicatorName === singleColouredRow ? (
							<TableRow sx={{ backgroundColor: '#b4c6cf' }}>
								<TableCell align="center">
									<b>{row.count}</b>
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
							</TableRow>
						) : (
							<TableRow hover>
								<TableCell align="center">{row['isTableHead'] ? <b>{row.count}</b> : row.count}</TableCell>
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
							</TableRow>
						)}
					</Fragment>
				))}
			</TableBody>
		),
		[]
	)

	return renderTableBody(tableData)
}

export default RenderLiquidityBody
