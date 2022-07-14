import React from 'react'
import TableCell from "@material-ui/core/TableCell"
import {formatOneDate} from "../../../utils"

const ReverseFormattedDate = (date) => {
    return (
        <>
            <TableCell align='right'>{date === "0" || date === null ? '' : formatOneDate(date)}</TableCell>
        </>
    )
}

export default ReverseFormattedDate