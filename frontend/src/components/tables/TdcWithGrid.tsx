import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import { formatNumber } from '../../utils'
import { useState } from 'react'

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
    field: 'dateEnd',
    headerName: 'Дата размещения по договору',
    type: 'string',
    width: 220,
    editable: true,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'dateBegin',
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


export default function DataGridDemo({ rows = [] }) {
  const [pageSize, setPageSize] = useState(30)
  return (
    <Box component={Paper} sx={{ height: '90vh', width: '100%' }}>
      <DataGrid
        rows={rows}
        sx={{
          '&.MuiDataGrid-columnSeparator': {
            display: 'none'
          },
          '.MuiDataGrid-columnHeader': {
            border: '0.1px solid #eee'
          },
          '.MuiDataGrid-columnHeaders': {
            backgroundColor: '#7794aa',
            color: '#fff',
            fontWeight: 'bold'
          },
          '.MuiDataGrid-cell': {
            border: '0.1px solid #eee',
            whiteSpace: 'wrap'
          },
          '.MuiDataGrid-columnSeparator': {
            display: 'none'
          }
        }}
        onPageSizeChange={setPageSize}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[30, 50]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        getRowId={(row: any) => row.index}
      />
    </Box>
  )
}
