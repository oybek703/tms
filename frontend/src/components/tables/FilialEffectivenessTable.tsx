import React, { Fragment, memo, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { formatNumber } from '../../utils'
import StyledDataGrid from '../UI/Layout/StyledDataGrid'

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

const FilialEffectivenessTable: React.FC<{ rows: unknown[] }> = function ({ rows = [] }) {
	return (
		<Fragment>
			<StyledDataGrid hideFooter columns={columns} rows={rows} />
		</Fragment>
	)
}

export default memo(FilialEffectivenessTable)
