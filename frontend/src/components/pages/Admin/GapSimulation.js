import React, { Fragment, useEffect, useState } from 'react'
import { Table, TableBody, TableContainer } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGap, fetchGapManual } from '../../../redux/actions'
import {
    GapTableHead,
    TotalOrBoldRow,
    VerticalColumn
} from '../../UI/Layout/GapHelpers'
import { v4 as uuid } from 'uuid'
import { makeStyles } from '@material-ui/core/styles'
import { formatNumber, getErrorMessage } from '../../../utils'
import axiosInstance, { withToken } from '../../../utils/axiosInstance'
import { toast } from 'react-toastify'
import Loader from '../../UI/Layout/Loader'
import Alert from '../../UI/Layout/Alert'
import Typography from '@material-ui/core/Typography'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import RotateLeftIcon from '@material-ui/icons/RotateLeft'
import SaveIcon from '@material-ui/icons/Save'
import { useHistory } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles(theme => ({
  noWrap: theme.mixins.noWrap,
  stickyTableHead: theme.mixins.stickyTableHead,
  verticalText: {
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)'
  },
  darkBackground: {
    backgroundColor: '#eeeeee',
    fontWeight: 'bold'
  },
  stickyCol: theme.mixins.stickyCol,
  bordered: theme.mixins.dottedBorder,
  blueBackground: theme.mixins.blueBackground,
  buttonsRow: {
    marginBottom: 5
  },
  actionContent: {
    padding: '5px 10px'
  },
  tableContainer: {
    maxHeight: '80vh'
  }
}))

const GapSimulation = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  const [newValue, setNewValue] = useState('')
  const [dialog, setDialog] = useState(false)
  const [editingCell, setEditingCell] = useState({})
  const { gapManual = {}, loading, error } = useSelector(
    state => state.gapManual)
  const {
    months = [],
    sourceOfLiquidity = [],
    sourceOfLiquidityTotal = [],
    needsOfLiquidity = [],
    needsOfLiquidityTotal = [],
    vlaLcrData = []
  } = gapManual

  function handleClose () {
    setDialog(false)
    setNewValue('')
  }

  async function handleEdit () {
    try {
      await axiosInstance.post(
        '/api/gapsimulation/update',
        {
          colName: editingCell['colName'],
          newValue, role: editingCell['role'],
          date: editingCell['monthIndex'],
          source: editingCell['source']
        },
        withToken()
      )
      handleClose()
      dispatch(fetchGapManual(true))
    } catch (e) {
      const message = getErrorMessage(e)
      toast.error(message)
    }
  }

  async function handleNewValueChange (e) {
    if (e.key === 'Enter') {
      await handleEdit()
    }
  }

  function handleEditClick (e) {
    const cellInfo = JSON.parse(e.target.dataset.cellinfo || '{}')
    setEditingCell(cellInfo)
    setDialog(true)
  }

  useEffect(() => {
    setNewValue(+(editingCell['numValue'] || 0).toFixed(2))
  }, [editingCell])
  const handleReset = () => {
    const option = window.confirm(
      'Вы уверены, что хотите сбросить разрыв до исходного состояния?')
    if (option) {
      dispatch(fetchGapManual())
    }
  }
  const handleSave = async () => {
    const option = window.confirm(
      'Вы уверены, что хотите сохранить изменения?')
    if (option) {
      try {
        await axiosInstance.put(
          '/api/gapsimulation/saveChanges',
          {},
          withToken()
        )
        toast.success('Изменения успешно сохранены.')
        dispatch(fetchGap())
        history.push('/gap')
      } catch (e) {
        const message = getErrorMessage(e)
        toast.error(message)
      }
    }
  }
  useEffect(() => {
    dispatch(fetchGapManual())
    return function () {
      dispatch(fetchGapManual())
    }
  }, [dispatch])

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser)
    return () => {
      window.removeEventListener('beforeunload', alertUser)
    }
  }, [])
  const alertUser = (e) => {
    e.preventDefault()
    e.returnValue = ''
  }
  const colNames = [
    { propName: 'TOTAL', eqv: 'Итого(UZS екв.)' },
    { propName: 'NATIONAL_CURRENCY', eqv: 'Нац.вал.(UZS)', canEdit: true },
    { propName: 'FOREIGN_CURRENCY', eqv: 'Ин.вал.(USD екв.)' },
    { propName: 'USD', eqv: 'USD', canEdit: true },
    { propName: 'EUR', eqv: 'EUR', canEdit: true }
  ]
  return (
    <Paper>
      {
        loading
          ? <Loader/>
          : error
          ? <Alert message={error}/> : <>
            <div className={classes.actionContent}>
              <div className={classes.buttonsRow}>
                <Button size='small' startIcon={<RotateLeftIcon/>}
                        variant='contained'
                        color="primary"
                        onClick={handleReset}>
                  Reset
                </Button>&nbsp;
                <Button size='small' startIcon={<SaveIcon/>}
                        variant='contained'
                        color="primary"
                        onClick={handleSave}>
                  Save
                </Button>&nbsp;
              </div>
              <Typography color='primary' component='i'>
                <b>Обратите внимание, что редактировать можно только
                  ячейки с
                  пунктирной
                  рамкой и не забудьте сохранить ваши изменения,
                  иначе они будут
                  сброшены.</b>
                <b>Для редактирования значения ячейки щелкните по
                  этой
                  ячейке.</b>
              </Typography>
            </div>
            {!dialog && <Fragment>
              <TableContainer classes={{ root: classes.tableContainer }}>
                <Table size="small" aria-label="a dense table">
                  <GapTableHead months={months}/>
                  <TableBody>
                    <VerticalColumn data={sourceOfLiquidity}
                                    text='источники ликвидности'/>
                    {sourceOfLiquidity.map(row => (
                      <TableRow key={uuid()}>
                        <TableCell align="left"
                                   className={`${classes.noWrap}`}>
                          {(row[0] || {})['INDICATOR_NAME']}
                        </TableCell>
                        {months.map(
                          (month, monthIndex) => <Fragment
                            key={uuid()}>
                            {colNames.map(
                              ({ propName, eqv, canEdit }) =>
                                <Fragment key={uuid()}>
                                  <TableCell
                                    className={`${classes.noWrap} 
                                                                    ${canEdit &&
                                    classes.bordered}`}
                                    data-cellinfo={canEdit &&
                                    JSON.stringify({
                                      source: (row[0] ||
                                        {})['SOURCE'],
                                      type: 'источники ликвидности',
                                      month: month,
                                      monthIndex: monthIndex +
                                        1,
                                      role: (row[0] ||
                                        {})['ROLE'],
                                      name: (row[0] ||
                                        {})['INDICATOR_NAME'],
                                      cellName: eqv,
                                      colName: propName,
                                      numValue: (row[monthIndex] ||
                                        {})[[propName]],
                                      current: formatNumber(
                                        (row[monthIndex] ||
                                          {})[[propName]])
                                    })}
                                    onClick={canEdit
                                      ? handleEditClick
                                      : () => {
                                      }
                                    }
                                    title={canEdit &&
                                    'Нажмите, чтобы изменить'}
                                    align="center">
                                    {formatNumber(
                                      (row[monthIndex] ||
                                        {})[[propName]],
                                      true)}
                                  </TableCell>
                                </Fragment>)}
                          </Fragment>)}
                      </TableRow>
                    ))}
                    <TotalOrBoldRow months={months}
                                    blueBackground
                                    total={sourceOfLiquidityTotal}/>
                    <VerticalColumn data={needsOfLiquidity}
                                    text='потребности ликвидности'/>
                    {needsOfLiquidity.map(row => (
                      <TableRow key={uuid()}>
                        <TableCell align="left"
                                   className={`${classes.noWrap}`}>
                          {(row[0] || {})['INDICATOR_NAME']}
                        </TableCell>
                        {months.map(
                          (month, monthIndex) => <Fragment
                            key={uuid()}>
                            {colNames.map(
                              ({ propName, eqv, canEdit }) =>
                                <Fragment key={uuid()}>
                                  <TableCell
                                    className={`${classes.noWrap} 
                                                                    ${canEdit &&
                                    classes.bordered}`}
                                    data-cellinfo={canEdit &&
                                    JSON.stringify({
                                      source: (row[0] ||
                                        {})['SOURCE'],
                                      type: 'потребности ликвидности',
                                      month: month,
                                      monthIndex: monthIndex +
                                        1,
                                      role: (row[0] ||
                                        {})['ROLE'],
                                      name: (row[0] ||
                                        {})['INDICATOR_NAME'],
                                      cellName: eqv,
                                      colName: propName,
                                      numValue: (row[monthIndex] ||
                                        {})[[propName]],
                                      current: formatNumber(
                                        (row[monthIndex] ||
                                          {})[[propName]])
                                    })}
                                    onClick={canEdit &&
                                    handleEditClick}
                                    title={canEdit &&
                                    'Нажмите, чтобы изменить'}
                                    align="center">
                                    {formatNumber(
                                      (row[monthIndex] ||
                                        {})[[propName]],
                                      true)}
                                  </TableCell>
                                </Fragment>)}
                          </Fragment>)}
                      </TableRow>
                    ))}
                    <TotalOrBoldRow months={months}
                                    blueBackground
                                    total={needsOfLiquidityTotal}/>
                    {vlaLcrData.map(
                      (row, index) => <TotalOrBoldRow
                        withPercent={index === 3}
                        blueBackground={index ===
                        3}
                        key={uuid()} align='left'
                        months={months}
                        total={row}/>)}
                  </TableBody>
                </Table>
              </TableContainer>
            </Fragment>}
            <Dialog open={dialog} onClose={handleClose}
                    aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Обновить
                значение</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Тип: {editingCell['type']}<br/>
                  Имя: {editingCell['name']}<br/>
                  Месяц(год): {editingCell['month']}<br/>
                  Имя ячейки: {editingCell['cellName']}<br/>
                  Текущий: {editingCell['current']}<br/>
                  Источник: {editingCell['source'] === 'AUTO'
                  ? 'Авто'
                  : 'Ручной'}<br/>
                </DialogContentText>
                <TextField
                  autoFocus
                  value={newValue}
                  onKeyDown={handleNewValueChange}
                  onChange={({ target: { value } }) => setNewValue(
                    value)}
                  margin="dense"
                  id="newLimit"
                  label="Новое значение"
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
    </Paper>
  )
}

export default GapSimulation