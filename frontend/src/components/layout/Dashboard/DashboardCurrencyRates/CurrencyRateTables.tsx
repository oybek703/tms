import React from 'react'
import { Table, TableBody, TableHead, TableRow } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import FormattedCell from '../../../helpers/formattedCell/FormattedCell'
import { v4 as uuid } from 'uuid'
import { formatNumber } from '../../../../utils'
import BoldWithColor from '../../../helpers/BoldWithColor'
import globalStyles from '../../../../styles/globalStyles'

const currencyOrder = ['USD', 'EUR', 'RUB', 'GBP', 'CHF', 'JPY', 'KZT', 'CNY']

interface DashboardCurrencyRatesProps {
	cbRate: any
}

function CurrencyTableHead() {
	return (
		<TableHead sx={globalStyles.stickyTableHead}>
			<TableRow>
				<TableCell align="center">
					<BoldWithColor>Валюта</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>Курс</BoldWithColor>
				</TableCell>
				<TableCell align="center">
					<BoldWithColor>Изм.</BoldWithColor>
				</TableCell>
			</TableRow>
		</TableHead>
	)
}

export const DashboardCurrencyRates: React.FC<DashboardCurrencyRatesProps> = ({ cbRate = [] }) => {
	return (
		<Table size="small" sx={{ backgroundColor: '#fff' }}>
			<CurrencyTableHead />
			<TableBody>
				{currencyOrder.map(currName => {
					const row = cbRate.find((curr: any) => curr['nominal'] === `1 ${currName}`)
					return (
						<TableRow hover key={uuid()}>
							<TableCell align="center">{(row || {})['nominal']}</TableCell>
							<TableCell align="center">{formatNumber((row || {})['equival'])}</TableCell>
							<TableCell align="center">
								<FormattedCell number={(row || {})['differ']} />
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	)
}

export const ExternalCurrencyRates = ({ rates = [] }) => {
	return (
		<Table size="small" sx={{ height: '100%', bgcolor: '#fff' }}>
			<TableHead sx={globalStyles.stickyTableHead}>
				<TableRow>
					<TableCell align="center">
						<BoldWithColor>Валюта</BoldWithColor>
					</TableCell>
					<TableCell align="center">
						<BoldWithColor>Покупка</BoldWithColor>
					</TableCell>
					<TableCell align="center">
						<BoldWithColor>Пок. изм.</BoldWithColor>
					</TableCell>
					<TableCell align="center">
						<BoldWithColor>Продажа</BoldWithColor>
					</TableCell>
					<TableCell align="center">
						<BoldWithColor>Про. изм.</BoldWithColor>
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{currencyOrder.map(currName => {
					const row: any = rates.find(curr => curr['nominal'] === `1 ${currName}`) || {}
					return (
						<TableRow hover key={uuid()}>
							<TableCell align="center">{(row || {})['nominal']}</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{formatNumber(+(row || {})['rateParch'] || 0, true)}
							</TableCell>
							<TableCell align="center">
								<FormattedCell dashForZero number={(row || {})['rateParchDiffer']} />
							</TableCell>
							<TableCell sx={globalStyles.noWrap} align="center">
								{formatNumber(+(row || {})['rateSal'] || 0, true)}
							</TableCell>
							<TableCell align="center">
								<FormattedCell dashForZero number={(row || {})['rateSalDiffer']} />
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	)
}
