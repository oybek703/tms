import React, { Fragment, memo } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableCap from '../UI/helpers/TableCap'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import { TableBody } from '@mui/material'
import { v4 as uuid } from 'uuid'
import { formatDate, formatNumber } from '../../utils'
import TableContainer from '@mui/material/TableContainer'
import TimeDepositsCard from '../UI/Layout/Tabs/TimeDepositsCard'
import Grid from '@mui/material/Grid'
import TimeDepositsByCurrency from '../charts/TimeDeposits/TimeDepositsByCurrency'
import TimeDepositsChange from '../charts/TimeDeposits/TimeDepositsChange'
import ExportButton from '../UI/Layout/ExportButton'
import BoldWithColor from '../UI/helpers/BoldWithColor'
import globalStyles from '../../styles/global-styles'

interface TimeDepositsTableProps {
	rows: any
	pickedDate: string
}

const TimeDepositsTable: React.FC<TimeDepositsTableProps> = function ({ rows = {}, pickedDate }) {
	const { yearFirstDate, monthFirstDate, selectedDate } = formatDate(pickedDate)
	const { tableData = [], currentBalance = [], balanceInMonthBegin = [] } = rows
	const changeData = currentBalance.map((v: any, i: number) => currentBalance[i] - balanceInMonthBegin[i])
	return (
		<Fragment>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={4}>
					<TimeDepositsCard data={currentBalance} title="Текущий остаток" />
				</Grid>
				<Grid item xs={12} sm={4}>
					<Grid item>
						<TimeDepositsCard data={balanceInMonthBegin} title="Остаток на начало месяца" />
					</Grid>
				</Grid>
				<Grid item xs={12} sm={4}>
					<TimeDepositsCard data={changeData} title="Изменение" />
				</Grid>
			</Grid>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<TimeDepositsByCurrency series={currentBalance} />
				</Grid>
				<Grid item xs={12} sm={6}>
					<TimeDepositsChange series={changeData} />
				</Grid>
			</Grid>
			<TableContainer component={Paper} sx={globalStyles.marginTop10}>
				<ExportButton id={`time-deposits-${selectedDate}`} />
				<Table size="small" id={`time-deposits-${selectedDate}`}>
					<TableCap rows={13} text={'млн.сум'} />
					<TableHead sx={globalStyles.stickyTableHead}>
						<TableRow>
							<TableCell align="center" rowSpan={3}>
								<BoldWithColor>№</BoldWithColor>
							</TableCell>
							<TableCell align="center" rowSpan={3}>
								<BoldWithColor>Наименование филиалов</BoldWithColor>
							</TableCell>
							<TableCell align="center" rowSpan={3}>
								<BoldWithColor>По состоянию на {yearFirstDate} года</BoldWithColor>
							</TableCell>
							<TableCell align="center" rowSpan={3}>
								<BoldWithColor>По состоянию на {monthFirstDate} года</BoldWithColor>
							</TableCell>
							<TableCell align="center" rowSpan={3}>
								<BoldWithColor>По состоянию на {selectedDate} года</BoldWithColor>
							</TableCell>
							<TableCell align="center" colSpan={4}>
								<BoldWithColor>Изменение</BoldWithColor>
							</TableCell>
							<TableCell align="center" colSpan={2} rowSpan={2}>
								<BoldWithColor>Возвращение/закрытие депозитов на текущий день</BoldWithColor>
							</TableCell>
							<TableCell align="center" colSpan={2} rowSpan={2}>
								<BoldWithColor>Возвращение/закрытие депозитов до конца текущего месяца</BoldWithColor>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell colSpan={2} align="center">
								<BoldWithColor>По сравнению на начало года</BoldWithColor>
							</TableCell>
							<TableCell colSpan={2} align="center">
								<BoldWithColor>По сравнению на начало месяца</BoldWithColor>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="center">
								<BoldWithColor>сумма</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>%</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>сумма</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>%</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>количество клиентов</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>сумма</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>количество клиентов</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>сумма</BoldWithColor>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="center">
								<BoldWithColor>А</BoldWithColor>
							</TableCell>
							<TableCell align="center">
								<BoldWithColor>Б</BoldWithColor>
							</TableCell>
							{Array(11)
								.fill('')
								.map((_, i) => (
									<TableCell key={uuid()} align="center">
										<BoldWithColor>{i + 1}</BoldWithColor>
									</TableCell>
								))}
						</TableRow>
					</TableHead>
					<TableBody>
						{tableData.map((r: any, i: number) => (
							<TableRow hover key={uuid()}>
								<TableCell align="center">{i + 1}</TableCell>
								<TableCell align="left">{r['filialName']}</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(r['yearBegin'], true)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(r['monthBegin'], true)}
								</TableCell>
								<TableCell
									align="center"
									sx={{
										...globalStyles.noWrap,
										backgroundColor: '#eee'
									}}
								>
									{formatNumber(r['selectedDate'], true)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(r['changeFromYB'], true)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(r['changeFromYBPercent'])}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(r['changeFromMB'], true)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(r['changeFromMBPercent'])}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{r['countInDate'] || '-'}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(r['sumInDate'], true)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{r['countInMonth'] || '-'}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(r['sumInMonth'], true)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Fragment>
	)
}

export default memo(TimeDepositsTable)
