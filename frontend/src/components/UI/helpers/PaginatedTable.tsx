import React, { Fragment } from 'react'
import TablePagination from '@material-ui/core/TablePagination'
import Paper from '@material-ui/core/Paper'

interface PaginatedTableProps {
    TableData: any
    page: number
    rowsPerPage: number
    setPage: any,
    setRowsPerPage: (rowsPerPage: number) => void,
    rows: any
}

const PaginatedTable: React.FC<PaginatedTableProps> = function({ TableData = '', page = 0, rowsPerPage = 15, setPage, setRowsPerPage, rows = [] }) {
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  return (
    <Fragment>
      {TableData}
      {/*
            // @ts-ignore*/}
      <TablePagination onPageChange={handleChangePage}
        labelRowsPerPage='Строк на странице'
        rowsPerPageOptions={[
          20,
          35,
          50,
          { label: 'Все', value: rows.length }]}
        component={Paper}
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Fragment>
  )
}

export default PaginatedTable
