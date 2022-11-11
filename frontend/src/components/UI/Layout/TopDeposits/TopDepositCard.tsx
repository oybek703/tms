import React, { memo } from 'react'
import { Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import { v4 as uuid } from 'uuid'
import { formatNumber, formatOneDate } from '../../../../utils'
import ExportButton from '../ExportButton'
import BoldWithColor from '../../helpers/BoldWithColor'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import globalStyles from '../../../../styles/global-styles'

interface TopDepositCardProps {
	data: any
	color: string
	currency: string
	title: string
}

const TopDepositCard: React.FC<TopDepositCardProps> = ({ data = [], currency = '', title = 'demo-title' }) => {
	const { reportDate } = useTypedSelector(state => state.operDays)
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
							<TableCell sx={{ maxWidth: '130px', fontSize: 13 }}>{d['name']}</TableCell>
							<TableCell align="center" sx={globalStyles.noWrap}>
								{formatNumber(d['saldoOut'])}
							</TableCell>
							<TableCell align="center">{d['percent'] && `${formatNumber(d['percent'])}%`}</TableCell>
						</TableRow>
					))}
					{data.length < 20 &&
						Array(20 - data.length)
							.fill('')
							.map((_, index) => (
								<TableRow key={uuid()}>
									<TableCell align="center">{index + data.length + 1}</TableCell>
									<TableCell sx={{ maxWidth: '130px', fontSize: 13 }} />
									<TableCell align="center" sx={globalStyles.noWrap} />
									<TableCell align="center" />
								</TableRow>
							))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default memo(TopDepositCard)
