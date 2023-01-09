import React, { memo, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { formatNumber } from '../../utils'
import StyledDataGrid from '../layout/StyledDataGrid'
import useTypedSelector from '../../hooks/useTypedSelector'

const columns: GridColDef[] = [
	{
		field: 'index',
		headerName: '№',
		align: 'center',
		maxWidth: 50,
		minWidth: 30,
		headerAlign: 'center',
		disableColumnMenu: true,
		sortable: false
	},
	{
		field: 'filialName',
		headerName: 'Наименование филиала',
		minWidth: 180,
		flex: 1,
		editable: true,
		align: 'left',
		headerAlign: 'center'
	},
	{
		field: 'codeCoa',
		headerName: 'Балансовый Счет',
		minWidth: 150,
		flex: 1,
		editable: true,
		align: 'center',
		headerAlign: 'center'
	},
	{
		field: 'clientName',
		headerName: 'Наименование организации разместившей депозит',
		type: 'string',
		width: 420,
		editable: true,
		align: 'center',
		headerAlign: 'center'
	},
	{
		field: 'dateBegin',
		headerName: 'Дата размещения по договору',
		type: 'string',
		width: 220,
		editable: true,
		align: 'center',
		headerAlign: 'center'
	},
	{
		field: 'dateEnd',
		headerName: 'Дата погашения по договору',
		type: 'string',
		width: 220,
		editable: true,
		align: 'center',
		headerAlign: 'center'
	},

	{
		field: 'currencyCode',
		headerName: 'Валюта счета',
		type: 'string',
		width: 150,
		editable: true,
		align: 'center',
		headerAlign: 'center'
	},
	{
		field: 'saldoOut',
		headerName: 'Сумма по договору (в номинале)',
		type: 'string',
		width: 220,
		editable: true,
		align: 'center',
		headerAlign: 'center',
		valueFormatter: ({ value }) => {
			return formatNumber(value)
		}
	},
	{
		field: 'saldoEquivalentOut',
		headerName: 'Сумма по договору (в сумовом эквиваленте)',
		type: 'string',
		width: 220,
		editable: true,
		align: 'center',
		headerAlign: 'center',
		valueFormatter: ({ value }) => {
			return formatNumber(value)
		}
	},
	{
		field: 'percent',
		headerName: '% ставка',
		type: 'string',
		width: 150,
		editable: true,
		align: 'center',
		headerAlign: 'center',
		valueFormatter: ({ value }) => {
			return `${formatNumber(value)} %`
		}
	}
]

const TimeDepoClientsTable = function () {
	const { timeDepoClients } = useTypedSelector(state => state.timeDepoClients)
	const [pageSize, setPageSize] = useState(30)
	return <StyledDataGrid onPageSizeChange={setPageSize} pageSize={pageSize} columns={columns} rows={timeDepoClients} />
}

export default memo(TimeDepoClientsTable)
