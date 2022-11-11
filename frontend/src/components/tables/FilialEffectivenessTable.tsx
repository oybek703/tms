import React, { Fragment, memo, useState } from 'react'
import { GridColDef, GridRowApi, GridRowSelectionCheckboxParams } from '@mui/x-data-grid'
import { formatNumber } from '../../utils'
import StyledDataGrid from '../UI/Layout/StyledDataGrid'
import { Box, Paper } from '@mui/material'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableCap from '../UI/helpers/TableCap'
import TableRow from '@mui/material/TableRow'
import globalStyles from '../../styles/globalStyles'

function generateCellAttrs<T extends GridColDef>(colDef: T, withPercent?: boolean): T {
	return {
		type: 'number',
		minWidth: 140,
		flex: 1,
		editable: false,
		align: 'center',
		headerAlign: 'center',
		valueFormatter: ({ value }) => {
			return withPercent ? `${formatNumber(value)} %` : formatNumber(value)
		},
		...colDef
	}
}

const columns: GridColDef[] = [
	generateCellAttrs({
		field: 'index',
		headerName: '№',
		minWidth: 50,
		valueFormatter: undefined,
		maxWidth: 10,
		disableColumnMenu: true,
		sortable: false
	}),
	generateCellAttrs({ field: 'mfo', headerName: 'МФО', minWidth: 80, valueFormatter: undefined }),
	generateCellAttrs({
		field: 'filialName',
		headerName: 'Наименование филиалов',
		minWidth: 220,
		type: 'string',
		renderCell: function ({ value }) {
			return <span style={{ fontWeight: 'bold' }}>{value}</span>
		}
	}),
	generateCellAttrs({ field: 'deposit202', headerName: 'Депозиты довостребования' }),
	generateCellAttrs({ field: 'deposit204', headerName: 'Сберегательные депозиты' }),
	generateCellAttrs({ field: 'deposit206', headerName: 'Срочные депозиты клиентов' }),
	generateCellAttrs({ field: 'totalLoan', headerName: 'Кредитний портфель', minWidth: 160 }),
	generateCellAttrs({ field: 'issuedLoans', headerName: 'Всего проблеманые кредиты' }),
	generateCellAttrs({ field: 'par30', headerName: 'PAR < 30' }),
	generateCellAttrs({ field: 'par60', headerName: 'PAR < 60' }),
	generateCellAttrs({ field: 'par90', headerName: 'PAR < 90' }),
	generateCellAttrs({ field: 'npl', headerName: 'NPL > 90' }),
	generateCellAttrs({ field: 'nplPercent', headerName: 'NPL (%)' }, true),
	generateCellAttrs({ field: 'accruedInterest', headerName: 'Начисленные проценты' }),
	generateCellAttrs({ field: 'roa', headerName: 'ROA' }, true),
	generateCellAttrs({ field: 'roe', headerName: 'ROE' }, true),
	generateCellAttrs({ field: 'resourceDebt', headerName: 'Задолженность по ресурсам перед ГО', minWidth: 160 }),
	generateCellAttrs({ field: 'benefitInMonth', headerName: 'Прибыль за месяц', minWidth: 160 })
]

interface total_indicator {
	name: string
	deposit202: number
	deposit204: number
	deposit206: number
	totalLoan: number
	issuedLoans: number
	par30: number
	par60: number
	par90: number
	npl: number
	nplPercent: number
	accruedInterest: number
	roa: number
	roe: number
	resourceDebt: number
	benefitInMonth: number
}

const FilialEffectivenessTable: React.FC<{ rows: total_indicator[] }> = function ({ rows = [] }) {
	// итого

	const total_deposit202: number = rows.reduce((previousValue: number, row) => {
		previousValue += row.deposit202
		return previousValue
	}, 0)

	const total_deposit204: number = rows.reduce((previousValue: number, row) => {
		previousValue += row.deposit204
		return previousValue
	}, 0)

	const total_deposit206: number = rows.reduce((previousValue: number, row) => {
		previousValue += row.deposit206
		return previousValue
	}, 0)
	const total_Loan: number = rows.reduce((previousValue: number, row) => {
		previousValue += row.totalLoan
		return previousValue
	}, 0)

	const total_issuedLoans: number = rows.reduce((previousValue: number, row) => {
		previousValue += row.issuedLoans
		return previousValue
	}, 0)

	const total_par30: number = rows.reduce((previousValue: number, row) => {
		previousValue += row.par30
		return previousValue
	}, 0)

	const total_par60: number = rows.reduce((previousValue: number, row) => {
		previousValue += row.par60
		return previousValue
	}, 0)

	const total_par90: number = rows.reduce((previousValue: number, row) => {
		previousValue += row.par90
		return previousValue
	}, 0)

	const total_npl: number = rows.reduce((previousValue: number, row) => {
		previousValue += row.npl
		return previousValue
	}, 0)

	const total_nplPercent: number = (100 * total_npl) / total_Loan

	const total_accruedInterest: number = rows.reduce((previousValue: number, row) => {
		previousValue += row.accruedInterest
		return previousValue
	}, 0)

	const total_resourceDebt: number = rows.reduce((previousValue: number, row) => {
		previousValue += row.resourceDebt
		return previousValue
	}, 0)

	const total_benefitInMonth: number = rows.reduce((previousValue: number, row) => {
		previousValue += row.benefitInMonth
		return previousValue
	}, 0)

	return (
		<Fragment>
			<TableContainer sx={{ marginTop: '20px', marginBottom: '30px' }} component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell></TableCell>
							<TableCell>Депозиты довостребования</TableCell>
							<TableCell>Сберегательные депозиты</TableCell>
							<TableCell>Срочные депозиты клиентов</TableCell>
							<TableCell>Кредитний портфель</TableCell>
							<TableCell>Всего проблеманые кредиты</TableCell>
							<TableCell>PAR 30</TableCell>
							<TableCell>PAR 60</TableCell>
							<TableCell>PAR 90</TableCell>
							<TableCell>NPL 90</TableCell>
							<TableCell>NPL %</TableCell>
							<TableCell>Начисленные проценты</TableCell>
							<TableCell>ROA</TableCell>
							<TableCell>ROE</TableCell>
							<TableCell>Задолженность по ресурсам перед ГО</TableCell>
							<TableCell>Прибыль за месяц</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>Итого</TableCell>
							<TableCell>{total_deposit202}</TableCell>
							<TableCell>{total_deposit204}</TableCell>
							<TableCell>{total_deposit206}</TableCell>
							<TableCell>{total_Loan}</TableCell>
							<TableCell>{total_issuedLoans}</TableCell>
							<TableCell>{total_par30.toFixed(2)}</TableCell>
							<TableCell>{total_par60.toFixed(2)}</TableCell>
							<TableCell>{total_par90.toFixed(2)}</TableCell>
							<TableCell>{total_npl}</TableCell>
							<TableCell>{total_nplPercent.toFixed(2)}</TableCell>
							<TableCell>{total_accruedInterest.toFixed(2)}</TableCell>
							<TableCell>0</TableCell>
							<TableCell>0</TableCell>
							<TableCell>{total_resourceDebt.toFixed(2)}</TableCell>
							<TableCell>{total_benefitInMonth.toFixed(2)}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<StyledDataGrid hideFooter columns={columns} rows={rows} />
		</Fragment>
	)
}

export default memo(FilialEffectivenessTable)
