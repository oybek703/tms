import React, { useCallback } from 'react'
import { Paper, Table, TableBody, TableHead, TableRow } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import { v4 as uuid } from 'uuid'
import { formatNumber } from '../../../../utils'
import PercentIndicator from './PercentIndicator'
import BoldWithColor from '../../../helpers/BoldWithColor'
import globalStyles from '../../../../styles/globalStyles'

const currencyOrder = ['USD', 'EUR', 'JPY', 'GBP', 'KZT', 'RUB', 'CHF', 'CNY']

const Position = ({ position = [] }) => {
	const reOrderedPosition = currencyOrder.map(title => position.find(currency => (currency || {})['name'] === title))
	const totalPercent = useCallback(
		function () {
			return position.reduce((acc, val) => (acc += val['percent']), 0)
		},
		[position]
	)
	const totalSumEquivalent = useCallback(
		function () {
			return position.reduce((acc, val) => (acc += val['sumEquival']), 0)
		},
		[position]
	)
	return (
		<Paper sx={{ minHeight: 372 }}>
			<Table size="small">
				<TableHead>
					<TableRow sx={globalStyles.stickyTableHead}>
						<TableCell align="center">
							<BoldWithColor>Валюта</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>Позиция в номинале</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>Позиция в сумовом эквиваленте</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>%</BoldWithColor>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{reOrderedPosition.map((row: any = {}) => (
						<TableRow hover key={uuid()}>
							<TableCell align="center">{row['name']}</TableCell>
							<TableCell sx={{ color: '#009c34' }} align="center">
								{formatNumber(row['equival'])}
							</TableCell>
							<TableCell sx={{ color: '#009c34' }} align="center">
								{formatNumber(row['sumEquival'])}
							</TableCell>
							<TableCell align="center">
								<PercentIndicator number={row['percent']} />
							</TableCell>
						</TableRow>
					))}
					<TableRow hover>
						<TableCell align="center" colSpan={2}>
							<b>Суммарная величина позиций</b>
						</TableCell>
						{/* <TableCell align="center" sx={{ ...globalStyles.noWrap, color: '#009c34' }}></TableCell> */}
						<TableCell align="center" sx={{ ...globalStyles.noWrap, color: '#009c34' }}>
							<b>{formatNumber(totalSumEquivalent())}</b>
						</TableCell>
						<TableCell align="center">
							<PercentIndicator total number={totalPercent()} />
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Paper>
	)
}

export default Position
