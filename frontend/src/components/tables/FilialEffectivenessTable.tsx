import React, { Fragment, memo } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { formatNumber } from '../../utils'
import StyledDataGrid from '../layout/StyledDataGrid'
import { IFcrbTableRow } from '../../interfaces/tables.interfaces'
import { Table, TableContainer, TableRow, TableHead, TableBody, TableCell, Paper } from '@mui/material'
import globalStyles from '../../styles/globalStyles'
import BoldWithColor from '../helpers/BoldWithColor'

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

const RowsInitialState: IFcrbTableRow = {
	npl: 0,
	roe: 0,
	roa: 0,
	totalLoan: 0,
	accruedInterest: 0,
	benefitInMonth: 0,
	deposit202: 0,
	deposit204: 0,
	deposit206: 0,
	par60: 0,
	par90: 0,
	par30: 0,
	issuedLoans: 0,
	nplPercent: 0,
	resourceDebt: 0,
	mfo: '',
	filialName: ''
}

function calcTotal(rows: IFcrbTableRow[]): IFcrbTableRow | undefined {
	if (rows.length !== 0) {
		return rows.reduce((previousValue, currentValue) => {
			previousValue.npl += currentValue.npl
			previousValue.totalLoan += currentValue.totalLoan
			previousValue.issuedLoans += currentValue.issuedLoans
			previousValue.par60 += currentValue.par60
			previousValue.par90 += currentValue.par90
			previousValue.par30 += currentValue.par30
			previousValue.totalLoan += currentValue.totalLoan
			previousValue.roe += currentValue.roe
			previousValue.roa += currentValue.roa
			previousValue.nplPercent += currentValue.nplPercent
			previousValue.deposit202 += currentValue.deposit202
			previousValue.deposit204 += currentValue.deposit204
			previousValue.deposit206 += currentValue.deposit206
			previousValue.resourceDebt += currentValue.resourceDebt
			previousValue.benefitInMonth += currentValue.benefitInMonth
			previousValue.accruedInterest += currentValue.accruedInterest
			previousValue.filialName = 'Итого'
			return previousValue
		}, RowsInitialState)
	}
}

const FilialEffectivenessTable: React.FC<{ rows: IFcrbTableRow[] }> = function ({ rows = [] }) {
	const totalData: IFcrbTableRow | undefined = calcTotal(rows)
	return (
		<Fragment>
			<StyledDataGrid hideFooter columns={columns} rows={rows} />
			{totalData && (
				<TableContainer component={Paper} sx={{ mb: '5px', pb: 0, overflow: 'auto', mt: 2 }}>
					<Table size="small">
						<TableHead sx={globalStyles.stickyTableHead}>
							<TableRow>
								<TableCell colSpan={3} />
								<TableCell align="center">
									<BoldWithColor>Депозиты довостребования</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>Сберегательные депозиты</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>Срочные депозиты клиентов</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>Кредитний портфель</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>Всего проблеманые кредиты</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>PAR {'<'} 30</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>PAR {'<'} 60</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>PAR {'<'} 90</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>NPL {'>'} 90</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>NPL (%)</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>Начисленные проценты</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>ROA</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>ROE</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>Задолженность по ресурсам перед ГО</BoldWithColor>
								</TableCell>
								<TableCell align="center">
									<BoldWithColor>Прибыль за месяц</BoldWithColor>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell colSpan={3} align="center" sx={{ fontWeight: 'bold' }}>
									{totalData.filialName}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(totalData.deposit202)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(totalData.deposit204)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(totalData.deposit206)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(totalData.totalLoan)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(totalData.issuedLoans)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(totalData.par30)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(totalData.par60)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(totalData.par90)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(totalData.npl)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(totalData.nplPercent)}%
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(totalData.accruedInterest)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									0{/* {formatNumber(totalData.roa)} */}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									0{/* {formatNumber(totalData.roe)} */}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(totalData.resourceDebt)}
								</TableCell>
								<TableCell align="center" sx={globalStyles.noWrap}>
									{formatNumber(totalData.benefitInMonth)}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Fragment>
	)
}

export default memo(FilialEffectivenessTable)
