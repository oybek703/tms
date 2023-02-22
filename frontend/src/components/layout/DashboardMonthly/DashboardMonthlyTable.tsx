import React, { Fragment, memo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { formatNumber, formatOneDate } from '../../../utils'
import TableCap from '../../helpers/TableCap'
import { v4 as uuid } from 'uuid'
import ExportButton from '../ExportButton'
import InlineDatePicker from '../Pickers/InlineDatePicker'
import globalStyles from '../../../styles/globalStyles'
import { format } from 'date-fns'

interface DashboardMonthlyTableProps {
	rows: any
	firstDate: string
	secondDate: string
	handleDateChange: (date: string) => void
}

function RenderBoldOrIndent({ row }: { row: any }) {
	const { indicatorName } = row
	return (
		<TableCell>
			{row['isTableHead'] ? (
				<b>{indicatorName}</b>
			) : (
				<>
					{indicatorName === '-средневзвешенные процентные ставки' ? (
						<span>&nbsp; &nbsp; &nbsp;{indicatorName}</span>
					) : (
						indicatorName
					)}
				</>
			)}
		</TableCell>
	)
}

const DashboardMonthlyTable: React.FC<DashboardMonthlyTableProps> = ({
	rows = [],
	firstDate,
	secondDate,
	handleDateChange
}) => {
	const { capital = [], liquidity = [], riskPart = [] } = rows
	const colCount = (([...riskPart].pop() || {})['data'] || []).length
	const colsHead = (([...riskPart].pop() || {})['data'] || [])
		.map((c: any, i: number) => {
			if (i !== 0 && i !== colCount - 1) {
				return c['monthBegin'] || c['dateValue']
			}
			return undefined
		})
		.filter(Boolean)
	if (!(firstDate || secondDate || capital.length || liquidity.length || riskPart.length)) {
		return <Fragment />
	}
	return (
		<TableContainer component={Paper}>
			<ExportButton id="dashboard-monthly" />
			<Table id="dashboard-monthly" size="small" aria-label="a dense table">
				<TableCap rows={colCount + 4} text={'млн. сум'} />
				<TableHead>
					<TableRow>
						<TableCell align="center" rowSpan={2}>
							<b>№</b>
						</TableCell>
						<TableCell rowSpan={2} align="center">
							<b>Показатели</b>
						</TableCell>
						<TableCell sx={globalStyles.inlinePickerCell} align="center" rowSpan={2}>
							<b>{format(new Date(secondDate), '01.01.yyyy')}</b>
						</TableCell>
						{colsHead.map((h: any) => (
							<TableCell align="center" sx={globalStyles.noWrap} key={uuid()} rowSpan={2}>
								{h}
							</TableCell>
						))}
						<TableCell sx={globalStyles.inlinePickerCell} align="center" rowSpan={2}>
							<b>{format(new Date(secondDate), '01.MM.yyyy')}</b>
						</TableCell>
						<TableCell align="center" colSpan={2}>
							<b>Разница</b>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell align="center">
							<b>(+;-)</b>
						</TableCell>
						<TableCell align="center">
							<b>%</b>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{[
						{ rows: capital, title: 'КАПИТАЛ' },
						{ rows: liquidity, title: 'ЛИКВИДНОСТЬ' },
						{ rows: riskPart, title: 'КАЧЕСТВО АКТИВОВ' }
					].map(({ rows, title }) => (
						<Fragment key={uuid()}>
							<TableRow>
								<TableCell sx={globalStyles.blueBackground} align="center" colSpan={colCount + 6}>
									<b>{title}</b>
								</TableCell>
							</TableRow>
							{rows.map((row: any, index: number) => (
								<TableRow hover key={index}>
									<TableCell align="center">
										<b>{row['count']}</b>
									</TableCell>
									<RenderBoldOrIndent row={row} />
									{row['data'].map((d: any, j: number) => (
										<TableCell sx={globalStyles.noWrap} align="center" key={uuid()}>
											{formatNumber(d['sum'])} {row['withPercent'] ? '%' : ''}
										</TableCell>
									))}
									<TableCell sx={globalStyles.noWrap} align="center">
										{formatNumber(row['differ'])} {row['withPercent'] ? '%' : ''}
									</TableCell>
									<TableCell sx={globalStyles.noWrap} align="center">
										{row['differPercent']}
									</TableCell>
								</TableRow>
							))}
						</Fragment>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default memo(DashboardMonthlyTable)
