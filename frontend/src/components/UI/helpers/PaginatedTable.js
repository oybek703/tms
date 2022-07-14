import React, {Fragment} from 'react'
import TablePagination from "@material-ui/core/TablePagination"
import Paper from "@material-ui/core/Paper"

export default function PaginatedTable({TableData = '', page = 0, rowsPerPage = 15, setPage, setRowsPerPage, rows = []}) {
    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }
    return (
        <Fragment>
            {TableData}
            <TablePagination
              labelRowsPerPage='Строк на странице'
                rowsPerPageOptions={[20, 35, 50, {label: 'Все', value: rows.length}]}
                component={Paper}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Fragment>
    )
}
