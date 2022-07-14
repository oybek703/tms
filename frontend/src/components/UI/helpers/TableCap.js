import React from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    no_border: {
        border: 'none',
        backgroundColor: '#fff',
        whiteSpace: 'nowrap'
    },
    redBack: {
        color: ({isGrey, redBack}) => isGrey || redBack ? '#fff' : '#000',
        backgroundColor: ({isGrey, redBack}) => isGrey ? `#7794aa` : redBack ? 'red' : 'fff',
        fontSize: 14,
        textAlign: ({textAlign}) => textAlign
    }
}))

function Wrapper({children, isHead = true}) {
    return isHead ? <TableHead>{children}</TableHead> : <>{children}</>
}

const TableCap = ({rows, text, redBack = false, isGrey, isHead = true, cellStyles = {}, textAlign = 'right'}) => {
    const classes = useStyles({isGrey, redBack, textAlign})
    return (
        <Wrapper isHead={isHead}>
            <TableRow>
                {new Array(rows-1).fill('')
                    .map((c, i) => <TableCell style={{...cellStyles}} className={classes.no_border} key={i}><b>{''}</b></TableCell>)}
                <TableCell style={{...cellStyles}} className={`${classes.no_border} ${classes.redBack}`} align={textAlign}>
                    <b><i>{text}</i></b>
                </TableCell>
            </TableRow>
        </Wrapper>
    )
}

export default TableCap