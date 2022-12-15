import React, { memo, useCallback, useMemo, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { formatNumber } from '../../utils'
import StyledDataGrid from '../layout/StyledDataGrid'
import { FilialEffProperties, IFililiaEffRow } from '../../interfaces/filial-eff.interfaces'
import palette from '../../styles/palette'
import useTypedSelector from '../../hooks/useTypedSelector'
import { FormControl, InputLabel, MenuItem, Paper, Select, Tooltip } from '@mui/material'
import FEChart from '../charts/filialEffectiveness/FEChart'
import { v4 as uuid } from 'uuid'

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
		renderCell: function ({ value, id, field, row: { filialName } }) {
			if (id === 23) {
				if (field === 'index') return <span style={pageStyles.totalRow}>ИТОГО</span>
			}
			if (field !== 'index' && id === 23)
				return <span style={pageStyles.totalRow}>{withPercent ? `${formatNumber(value)} %` : formatNumber(value)}</span>
			if (!['index', 'mfo'].includes(field))
				return (
					<Tooltip style={{ cursor: 'pointer' }} title={filialName} arrow disableInteractive>
						<span>{withPercent ? `${formatNumber(value)} %` : formatNumber(value)}</span>
					</Tooltip>
				)
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
	generateCellAttrs({ field: 'mfo', headerName: FilialEffProperties.mfo, minWidth: 80, valueFormatter: undefined }),
	generateCellAttrs({
		field: 'filialName',
		headerName: FilialEffProperties.filialName,
		minWidth: 220,
		sortable: false,
		editable: false,
		type: 'string',
		renderCell: function ({ value }) {
			return (
				<span className="filialName" style={{ fontWeight: 'bold' }}>
					{value}
				</span>
			)
		}
	}),
	generateCellAttrs({ field: 'deposit202', headerName: FilialEffProperties.deposit202 }),
	generateCellAttrs({ field: 'deposit204', headerName: FilialEffProperties.deposit204 }),
	generateCellAttrs({ field: 'deposit206', headerName: FilialEffProperties.deposit206 }),
	generateCellAttrs({ field: 'totalLoan', headerName: FilialEffProperties.totalLoan, minWidth: 160 }),
	generateCellAttrs({ field: 'issuedLoans', headerName: FilialEffProperties.issuedLoans }),
	generateCellAttrs({ field: 'par30', headerName: FilialEffProperties.par30 }),
	generateCellAttrs({ field: 'par60', headerName: FilialEffProperties.par60 }),
	generateCellAttrs({ field: 'par90', headerName: FilialEffProperties.par90 }),
	generateCellAttrs({ field: 'npl', headerName: FilialEffProperties.npl }),
	generateCellAttrs({ field: 'nplPercent', headerName: FilialEffProperties.nplPercent }, true),
	generateCellAttrs({ field: 'accruedInterest', headerName: FilialEffProperties.accruedInterest }),
	generateCellAttrs({ field: 'roa', headerName: FilialEffProperties.roa }, true),
	generateCellAttrs({ field: 'roe', headerName: FilialEffProperties.roe }, true),
	generateCellAttrs({ field: 'resourceDebt', headerName: FilialEffProperties.resourceDebt, minWidth: 160 }),
	generateCellAttrs({ field: 'benefitInMonth', headerName: FilialEffProperties.benefitInMonth, minWidth: 160 })
]

const FilialEffectivenessTable = function () {
	const [key, setKey] = useState<keyof Omit<IFililiaEffRow, 'mfo' | 'filialName'>>('deposit202')
	const {
		filialEffectiveness: { allData, roeTotal, roaTotal }
	} = useTypedSelector(state => state.filialEffectiveness)
	const RowsInitialState: IFililiaEffRow = useMemo(
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
		(rows: IFililiaEffRow[]): IFililiaEffRow | undefined => {
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
	const totalData = useMemo(() => calcTotal(allData), [allData])
	const updatedTotalData = {
		...totalData,
		nplPercent: ((totalData?.npl || 0) * 100) / (totalData?.totalLoan || 0),
		roa: roaTotal,
		roe: roeTotal
	}
	const newRows = [...allData, updatedTotalData]
	const categories = allData.map(({ filialName }) => filialName.replace('ФИЛИАЛИ', ''))
	const filialData = allData.map(value => value[key])
	return (
		<>
			<StyledDataGrid hideFooter columns={columns} rows={newRows} />
			<Paper sx={{ my: 1, pt: 1 }}>
				<FormControl sx={{ m: 1, minWidth: 220 }} size="small">
					<InputLabel id="demo-select-small">Категория</InputLabel>
					<Select value={key} label="Категория" onChange={({ target: { value } }) => setKey(value as typeof key)}>
						{Object.entries(FilialEffProperties).map(([localKey, title]) => {
							if (![FilialEffProperties.mfo, FilialEffProperties.filialName].includes(title)) {
								return (
									<MenuItem key={uuid()} value={localKey}>
										{title}
									</MenuItem>
								)
							}
						})}
					</Select>
				</FormControl>
				<FEChart
					totalData={totalData ? totalData[key] : 0}
					filialData={filialData}
					propertyName={FilialEffProperties[key]}
					categories={categories}
					id="fe_chart"
				/>
			</Paper>
		</>
	)
}

export default memo(FilialEffectivenessTable)
