import React, { memo, useEffect, useState } from 'react'
import Paper from '@material-ui/core/Paper'
import { CardContent, makeStyles, TableContainer } from '@material-ui/core'
import Loader from '../../../UI/Layout/Loader'
import Alert from '../../../UI/Layout/Alert'
import axiosInstance, { withToken } from '../../../../utils/axiosInstance'
import { formatNumber, getErrorMessage } from '../../../../utils'
import { toast } from 'react-toastify'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import Table from '@material-ui/core/Table'
import { v4 as uuid } from 'uuid'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import useActions from '../../../../hooks/useActions'

const useStyles = makeStyles((theme) => ({
  noWrap: theme.mixins.noWrap,
  editCell: {
    cursor: 'pointer',
    ...theme.mixins.dottedBorder
  }
}))

const UpdateLimitOfBanks = () => {
  const { fetchBankLimits } = useActions()
  const classes = useStyles()
  const [dialog, setDialog] = useState(false)
  const [editingCell, setEditingCell] = useState<any>({})
  const [newLimit, setNewLimit] = useState<any>('')
  const [beginDate, setBeginDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const { bankLimits = {}, loading, error } = useTypedSelector((state) => state.bankLimits)
  const { dates, tableData = [] } = bankLimits
  const [months = {}] = dates || []
  const currencies = Object.keys(tableData[0] || {})
      .filter((key) => key !== 'CLIENT_CODE' && key !== 'NAME')
  useEffect(() => {
    fetchBankLimits()
  }, [fetchBankLimits])
  useEffect(() => {
    if (months['BEGIN']) setBeginDate(months['BEGIN'])
    if (months['END']) setEndDate(months['END'])
  }, [months])

  async function handleDatesChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      await axiosInstance.post(
          '/api/banklimits/updateDates',
          { beginDate, endDate },
          withToken()
      )
      fetchBankLimits()
    } catch (e) {
      const message = getErrorMessage(e)
      toast.error(message)
    }
  }

  function handleClose() {
    setNewLimit('')
    setDialog(false)
  }

  async function handleEdit() {
    try {
      await axiosInstance.post(
          '/api/banklimits/updateLimit',
          { ...editingCell, newLimit },
          withToken()
      )
      handleClose()
      fetchBankLimits()
    } catch (e) {
      const message = getErrorMessage(e)
      toast.error(message)
    }
  }

  function handleEditClick(e: any) {
    const cellInfo = JSON.parse(e.target.dataset.cellinfo)
    setEditingCell(cellInfo)
    setDialog(true)
  }

  async function handleLimitChange(e: any) {
    if (e.key === 'Enter') {
      await handleEdit()
    }
  }

  return (
    <Paper>
      <CardContent>
        {
                    loading ?
                        <Loader/> :
                        error ?
                        <Alert message={error}/> : <>
                          <h2>Лимит банков</h2>
                          <hr/>
                          {beginDate && endDate && <>
                            <h4>Срок действия</h4>
                            <form onSubmit={handleDatesChange}>
                              <label htmlFor="begin">С &nbsp;</label>
                              <input value={beginDate} required
                                onChange={(e) => setBeginDate(e.target.value)}
                                type="date"/> &nbsp; &nbsp; &nbsp;
                              <label htmlFor="end">До &nbsp;</label>
                              <input value={endDate}
                                required
                                onChange={(e) => setEndDate(e.target.value)}
                                type="date"/>
                                    &nbsp; &nbsp; &nbsp;
                              <button>Обновить срок</button>
                            </form>
                            <h4>Действующие лимиты операций с зарубежными банками</h4>
                            <Typography color='primary' component='i'>
                                    Нажмите на ячейку с пунктирной рамкой, чтобы изменить ее значение
                            </Typography>
                            <hr/>
                          </>}
                          {!dialog && <TableContainer>
                            <Table stickyHeader size="small" aria-label="a dense table">
                              <TableHead>
                                <TableRow>
                                  <TableCell>№</TableCell>
                                  <TableCell>Code</TableCell>
                                  <TableCell>Name</TableCell>
                                  {currencies.map((c) => <TableCell key={uuid()}>{c}</TableCell>)}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {tableData.map((row: any, index: number) => <TableRow key={uuid()}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{row['CLIENT_CODE']}</TableCell>
                                  <TableCell>{row['NAME']}</TableCell>
                                  {currencies.map((c) => <TableCell
                                    className={`${classes.noWrap} ${classes.editCell}`}
                                    data-cellinfo={JSON.stringify({
                                      code: row['CLIENT_CODE'],
                                      name: row['NAME'],
                                      currency: c,
                                      value: row[c] })
                                    }
                                    onClick={handleEditClick}
                                    title='Нажмите, чтобы изменить'
                                    key={uuid()}>
                                    {formatNumber(row[c])}
                                  </TableCell>)}
                                </TableRow>)}
                              </TableBody>
                            </Table>
                          </TableContainer>}
                          <Dialog open={dialog} onClose={handleClose}
                            aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Обновить лимит</DialogTitle>
                            <DialogContent>
                              <DialogContentText>
                                        Имя: {editingCell['name']}<br/>
                                        Код: {editingCell['code']}<br/>
                                        Валюта: {editingCell['currency']}<br/>
                                        Текущий лимит: {formatNumber(editingCell['value'])}<br/>
                              </DialogContentText>
                              <TextField
                                autoFocus
                                value={newLimit}
                                onKeyDown={handleLimitChange}
                                onChange={({ target: { value } }) => setNewLimit(+value)}
                                margin="dense"
                                id="newLimit"
                                label="Новый лимит"
                                type="number"
                                required
                                fullWidth
                              />
                            </DialogContent>
                            <DialogActions>
                              <Button variant='outlined'
                                onClick={setDialog.bind(null, false)}
                                color="primary">
                                        Отмена
                              </Button>
                              <Button variant='outlined'
                                onClick={handleEdit}
                                color="primary">
                                        Обновить
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </>
        }
      </CardContent>
    </Paper>
  )
}

export default memo(UpdateLimitOfBanks)
