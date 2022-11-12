import React, { Fragment, memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import Paper from '@mui/material/Paper'
import { formatNumber } from '../../utils'
import TableRow from '@mui/material/TableRow'
import { TableCell } from '@mui/material'
import BoldWithColor from '../helpers/BoldWithColor'
import { v4 as uuid } from 'uuid'
import globalStyles from '../../styles/globalStyles'

interface RowData {
	code: string
	title: string
	data: {
		name: string
		moreOperations: string
		quick: string
		safe: string
		expensiveOrCheap: string
		saldoOut: number
		turnoverDebit: number
		percentDebit: number
		turnoverCredit: number
		percentCredit: number
		import: string
		export: string
		accredetiv: string
		interbankDeposit: string
		forex: string
		creditLine: string
		vostro: string
		useForPayment: string
	}[]
}

interface NostroMatrixTableProps {
	rows: RowData[]
	noData?: boolean
}

function EmptyCell() {
	return <TableCell sx={{ background: '#fff', border: 'none' }} rowSpan={2} />
}

function NoBorderCell() {
	return <TableCell sx={{ border: 'none' }} />
}

function RowTitle({ title = '', colSpan = 1 }) {
	return (
		<TableCell colSpan={colSpan} align="center" style={{ fontSize: '1.1em' }}>
			<b>{title}</b>
		</TableCell>
	)
}

const NostroMatrixTable: React.FC<NostroMatrixTableProps> = function ({ rows, noData }) {
	if (noData) return <Fragment />
	return (
		<TableContainer component={Paper}>
			<Table size="small" aria-label="a dense table">
				<TableHead sx={globalStyles.stickyTableHead}>
					<TableRow>
						<TableCell sx={globalStyles.noWrap} colSpan={2} rowSpan={2} align="center">
							<BoldWithColor>Наименование</BoldWithColor>
						</TableCell>
						<EmptyCell />
						<TableCell sx={globalStyles.noWrap} colSpan={4} align="center">
							<BoldWithColor>Качество обслуживание</BoldWithColor>
						</TableCell>
						<EmptyCell />
						<TableCell sx={globalStyles.noWrap} colSpan={5} align="center">
							<BoldWithColor>Информация о остатках и оборотах</BoldWithColor>
						</TableCell>
						<EmptyCell />
						<TableCell sx={globalStyles.noWrap} colSpan={7} align="center">
							<BoldWithColor>Виды операций</BoldWithColor>
						</TableCell>
					</TableRow>
					<TableRow>
						{[
							'объем операций',
							'оперативность',
							'безопасность',
							'стоимость',
							`Остаток`,
							'Оборот Дебет',
							'Доля от д-т об-т.(%)',
							'Оборот Кредит',
							'Доля от кр-т об-т.(%)',
							'Импорт',
							'Экспорт',
							'Пост. фин.',
							'МБД',
							'FX',
							'Кредитная линия',
							'Востро'
						].map(title => (
							<TableCell align="center" key={uuid()} sx={globalStyles.noWrap}>
								<BoldWithColor>{title}</BoldWithColor>
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{rows &&
						rows.map((row, _index) => (
							<Fragment key={uuid()}>
								<TableRow hover>
									<RowTitle title={row.title} colSpan={2} />
									<NoBorderCell />
									<RowTitle title={row.title} colSpan={4} />
									<NoBorderCell />
									<RowTitle title={row.title} colSpan={5} />
									<NoBorderCell />
									<RowTitle title={row.title} colSpan={7} />
								</TableRow>
								{row.data.map((cell, index) => (
									<TableRow hover key={uuid()}>
										<TableCell align="center">
											<b>{index + 1}</b>
										</TableCell>
										<TableCell sx={globalStyles.noWrap}>
											<b>{cell.name}</b>
										</TableCell>
										<NoBorderCell />
										<TableCell align="center">{cell.moreOperations}</TableCell>
										<TableCell align="center">{cell.quick}</TableCell>
										<TableCell align="center">{cell.safe}</TableCell>
										<TableCell align="center">{cell.expensiveOrCheap}</TableCell>
										<NoBorderCell />
										<TableCell align="center" sx={globalStyles.noWrap}>
											{formatNumber(cell.saldoOut)}
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											{formatNumber(cell.turnoverDebit)}
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											{formatNumber(cell.percentDebit)}
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											{formatNumber(cell.turnoverCredit)}
										</TableCell>
										<TableCell align="center" sx={globalStyles.noWrap}>
											{formatNumber(cell.percentCredit)}
										</TableCell>
										<NoBorderCell />
										<TableCell align="center">{cell.import}</TableCell>
										<TableCell align="center">{cell.export}</TableCell>
										<TableCell align="center">{cell.accredetiv}</TableCell>
										<TableCell align="center">{cell.interbankDeposit}</TableCell>
										<TableCell align="center">{cell.forex}</TableCell>
										<TableCell align="center">{cell.creditLine}</TableCell>
										<TableCell align="center">{cell.vostro}</TableCell>
									</TableRow>
								))}
							</Fragment>
						))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default memo(NostroMatrixTable)
