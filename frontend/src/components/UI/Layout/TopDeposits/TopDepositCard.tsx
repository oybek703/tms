import React, { memo } from 'react'
import { Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import { v4 as uuid } from 'uuid'
import { formatNumber, formatOneDate } from '../../../../utils'
import ExportButton from '../ExportButton'
import BoldWithColor from '../../helpers/BoldWithColor'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import globalStyles from '../../../../styles/globalStyles'

interface TopDepositCardProps {
	data: any
	color: string
	currency: string
	title: string
}

const TopDepositCard: React.FC<TopDepositCardProps> = ({
	data = [],
	color = '#eee',
	currency = '',
	title = 'demo-title'
}) => {
	while (data.length < 20) {
		data.push({})
	}
	const { reportDate } = useTypedSelector(state => state.date)
	return (
		<TableContainer component={Paper} sx={{ maxHeight: '700px' }}>
			<ExportButton id={`${title}-${currency}-${formatOneDate(reportDate)}`} />
			<Table size="small" id={`${title}-${currency}-${formatOneDate(reportDate)}`}>
				<TableHead sx={globalStyles.stickyTableHead}>
					<TableRow>
						<TableCell>{''}</TableCell>
						<TableCell align="center">
							<BoldWithColor>Наименование клиентов</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>{currency}</BoldWithColor>
						</TableCell>
						<TableCell align="center">
							<BoldWithColor>%</BoldWithColor>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((d: any, i: number) => (
						<TableRow hover key={uuid()}>
							<TableCell align="center">{i + 1}</TableCell>
							<TableCell sx={{ maxWidth: '130px', fontSize: 13 }}>{d['NAME']}</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(d['SALDO_OUT'])}
							</TableCell>
							<TableCell align="center">{d['PERCENT'] && `${formatNumber(d['PERCENT'])}%`}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default memo(TopDepositCard)
