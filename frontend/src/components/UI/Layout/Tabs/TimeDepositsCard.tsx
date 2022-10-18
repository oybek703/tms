import React from 'react'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import TableBody from '@mui/material/TableBody'
import { v4 as uuid } from 'uuid'
import { formatNumber } from '../../../../utils'
import BoldWithColor from '../../helpers/BoldWithColor'
import globalStyles from '../../../../styles/globalStyles'

interface TimeDepositsCardProps {
	title: string
	data: any
}

const TimeDepositsCard: React.FC<TimeDepositsCardProps> = ({ title = 'THERE MUST BE TITLE', data = [] }) => {
	return (
		<>
			<Table size="small">
				<TableHead sx={globalStyles.stickyTableHead}>
					<TableRow>
						<TableCell align="center">
							<BoldWithColor>{title}</BoldWithColor>
						</TableCell>
					</TableRow>
				</TableHead>
			</Table>
			<TableContainer sx={globalStyles.paddingBottom0} component={Paper}>
				<Table size="small">
					<TableHead>
						<TableRow hover>
							<TableCell />
							<TableCell align="center">
								<b>Суммовой эквивалент</b>
							</TableCell>
							<TableCell align="center">
								<b>Суммовой эквивалент в млн. сум</b>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{['UZS', 'USD', 'EUR'].map((c, i) => (
							<TableRow hover key={uuid()}>
								<TableCell align="center">{c}</TableCell>
								<TableCell align="center">{formatNumber(data[i])}</TableCell>
								<TableCell align="center">{formatNumber(data[i] / Math.pow(10, 6))}</TableCell>
							</TableRow>
						))}
						<TableRow hover>
							<TableCell colSpan={2} />
							<TableCell sx={globalStyles.blueBackground} align="center">
								<b>{formatNumber(data.reduce((acc: any, val: any) => (acc += val), 0) / Math.pow(10, 6))}</b>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<br />
		</>
	)
}

export default TimeDepositsCard
