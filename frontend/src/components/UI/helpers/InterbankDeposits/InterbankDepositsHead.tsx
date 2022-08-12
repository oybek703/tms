import React from 'react'
import TableCap from '../TableCap'
import { makeStyles, TableHead, TableRow } from '@material-ui/core'
import TableCell from '@material-ui/core/TableCell'
import BoldWithColor from '../BoldWithColor'

const useStyles = makeStyles((theme) => ({
  stickyTableHead: theme.mixins.stickyTableHead
}))

const InterbankDepositsHead = () => {
  const classes = useStyles()
  return (
    <>
      <TableCap rows={10} text={'в номинале'}/>
      <TableHead className={classes.stickyTableHead}>
        <TableRow>
          <TableCell align='center' rowSpan={2}><BoldWithColor>№</BoldWithColor></TableCell>
          <TableCell align='center' rowSpan={2}><BoldWithColor>Наименование банка</BoldWithColor></TableCell>
          <TableCell align='center' rowSpan={2}><BoldWithColor>Сумма по договору (в номинале)</BoldWithColor></TableCell>
          <TableCell align='center' rowSpan={2}><BoldWithColor>Дата привлечения</BoldWithColor></TableCell>
          <TableCell align='center' rowSpan={2}><BoldWithColor>Дата возвращения</BoldWithColor></TableCell>
          <TableCell align='center' rowSpan={2}><BoldWithColor>Процентная ставка</BoldWithColor></TableCell>
          <TableCell align='center' colSpan={2}><BoldWithColor>Ожидаемый расход</BoldWithColor></TableCell>
          <TableCell align='center' rowSpan={2}><BoldWithColor>Количество дней</BoldWithColor></TableCell>
          <TableCell align='center' rowSpan={2}><BoldWithColor>Доля в процентах</BoldWithColor></TableCell>
        </TableRow>
        <TableRow>
          <TableCell align='center'><BoldWithColor>За один день</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>За вес период</BoldWithColor></TableCell>
        </TableRow>
        <TableRow>
          <TableCell align='center'><BoldWithColor>А</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>Б</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>1</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>2</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>3</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>4</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>5</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>6</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>7</BoldWithColor></TableCell>
          <TableCell align='center'><BoldWithColor>8</BoldWithColor></TableCell>
        </TableRow>
      </TableHead>
    </>
  )
}

export default InterbankDepositsHead
