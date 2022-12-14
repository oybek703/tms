import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { formatNumber } from '../../utils'
import StyledDataGrid from '../layout/StyledDataGrid'
import { IFcrbTableRow } from '../../interfaces/tables.interfaces'
import palette from '../../styles/palette'
import useTypedSelector from '../../hooks/useTypedSelector'

const pageStyles = {
	totalRow: {
		display: 'grid',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: palette.primary,
		fontWeight: 'bold',
		color: '#fff',
		width: 'calc(100% + 20px)',
		height: '100%',
		transform: 'translateX(-10px)',
		marginRight: '-20px'
	}
}

function generateCellAttrs<T extends GridColDef>(colDef: T, withPercent?: boolean): T {
	return {
		type: 'number',
		minWidth: 140,
		flex: 1,
		editable: false,
		align: 'center',
		headerAlign: 'center',
		renderCell: function ({ value, id, field }) {
			if (id === 23) {
				if (field === 'index') return <span style={pageStyles.totalRow}>ИТОГО</span>
			}
			if (field !== 'index' && id === 23)
				return <span style={pageStyles.totalRow}>{withPercent ? `${formatNumber(value)} %` : formatNumber(value)}</span>
		},
		colSpan: function ({ id, field }) {
			if (id === 23 && field === 'index') {
				return 3
			}
			return 1
		},
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
		sortable: false,
		editable: false,
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

const FilialEffectivenessTable = function () {
	const { filialEffectiveness } = useTypedSelector(state => state.filialEffectiveness)
	const RowsInitialState: IFcrbTableRow = useMemo(
		() => ({
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
		}),
		[]
	)
	const calcTotal = useCallback(
		(rows: IFcrbTableRow[]): IFcrbTableRow | undefined => {
			if (rows.length !== 0) {
				return rows.reduce((previousValue, currentValue) => {
					previousValue.npl += currentValue.npl
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
		},
		[RowsInitialState]
	)
	// eslint-disable-next-line
	const totalData = useMemo(() => calcTotal(filialEffectiveness), [filialEffectiveness])
	const newRows = [
		...filialEffectiveness,
		{
			...totalData,
			nplPercent: ((totalData?.npl || 0) * 100) / (totalData?.totalLoan || 0),
			roa: 0,
			roe: 0
		}
	]
	return <StyledDataGrid hideFooter columns={columns} rows={newRows} />
}

export default memo(FilialEffectivenessTable)
