import React, { FC, PropsWithChildren } from 'react'
import Paper from '@mui/material/Paper'
import { DataGrid, DataGridProps, GridColDef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { ISxStyles } from '../../interfaces/styles.interface'

interface StyledDataGridProps extends DataGridProps {
	rows: unknown[]
	columns: GridColDef[]
}

const styles: ISxStyles = {
	'.MuiDataGrid-columnHeader': {
		border: '0.1px solid #eee'
	},
	'.MuiDataGrid-columnHeaders': {
		backgroundColor: '#7794aa',
		color: '#fff',
		fontWeight: 'bold',
		minHeight: '10px !important',
		height: '40px'
	},
	'.MuiDataGrid-cell': {
		border: '0.1px solid #eee',
		whiteSpace: 'wrap'
	},
	'.MuiDataGrid-columnSeparator': {
		display: 'none'
	},
	'.MuiDataGrid-sortIcon': {
		color: '#fff'
	},
	'.MuiDataGrid-menuIconButton': {
		color: '#fff'
	},
	'.MuiDataGrid-columnHeaderTitle': {
		fontWeight: 'bold'
	}
}

const StyledDataGrid: FC<PropsWithChildren<StyledDataGridProps>> = ({ rows, columns, ...props }) => {
	return (
		<Box component={Paper} sx={{ height: '75vh', width: '100%' }}>
			<DataGrid
				rows={rows.map((row: any, i: number) => ({ ...row, index: i + 1 }))}
				sx={styles}
				columns={columns}
				hideFooter={false}
				rowsPerPageOptions={[30, 50, 100]}
				getRowId={(row: any) => row.index}
				{...props}
			/>
		</Box>
	)
}

export default StyledDataGrid
