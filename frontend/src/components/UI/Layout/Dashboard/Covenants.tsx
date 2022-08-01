import React from 'react'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import { makeStyles, TableBody, TableContainer, TableRow } from '@material-ui/core'
import TableCell from '@material-ui/core/TableCell'
import { v4 as uuid } from 'uuid'
import { covenantData, Status } from '../../../../tempData'

const useStyles = makeStyles((theme) => ({
  noWrap: theme.mixins.noWrap,
  blueBackground: theme.mixins.blueBackground,
  stickyTableHead: theme.mixins.stickyTableHead,
  tableContainer: {
    maxHeight: '77vh'
  },
  greenCell: {
    backgroundColor: '#00B050',
    color: 'white'
  }
}))

function getColorByStatus(status: Status) {
  if (status === Status.safe) return '#00B050'
  if (status === Status.warn) return '#f38003'
  if (status === Status.danger) return '#ff6363'
  return '#fff'
}

const Covenants = () => {
  const classes = useStyles()
  return (
    <TableContainer className={classes.tableContainer} component={Paper}>
      <Table size='small'>
        <TableHead className={classes.stickyTableHead}>
          <TableRow>
            <TableCell className={classes.blueBackground} align='center' rowSpan={2}><b>№</b></TableCell>
            <TableCell className={classes.blueBackground} align='center' rowSpan={2}><b>Наименование
                            ковенанти</b></TableCell>
            <TableCell className={classes.blueBackground} align='center' rowSpan={2}><b>AO
                            Асакабанк</b></TableCell>
            <TableCell className={classes.blueBackground} align='center'
              colSpan={9}><b>Контрагент</b></TableCell>
          </TableRow>
          <TableRow>
            {[
              'China Development Bank',
              'Landesbank Baden-Wuerttemberg',
              'VTB BANK (EUROPE)',
              'АБР',
              'JPMorgan Chase Bank',
              'Turkiye Ihracat Kredi Bankasi A.S.',
              'Europe Asia Investment Finance B.V.',
              'Европейский Банк Реконструкции и Развития',
              'Deutsche Bank AG'
            ].map((bank) => <TableCell className={classes.blueBackground} key={uuid()} align='center'>
              <b>{bank}</b>
            </TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {covenantData.map((b, index) => (
            <TableRow key={uuid()}>
              <TableCell align='center'><b>{index + 1}</b></TableCell>
              <TableCell><b>{b.title}</b></TableCell>
              <TableCell align='center' className={classes.noWrap}>
                {b.main_bank} {typeof b.main_bank === 'number' && '%'}
              </TableCell>
              {Array(9).fill('').map((_, idx) => <TableCell
                key={uuid()}
                className={classes.noWrap}
                align='center'
                style={{
                  // @ts-ignore
                  backgroundColor: getColorByStatus(b[`bank_${idx+1}`].status),
                  color: '#fff'
                // @ts-ignore
                }}><b><i>{b[`bank_${idx+1}`].value}</i></b>
              </TableCell> )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Covenants
