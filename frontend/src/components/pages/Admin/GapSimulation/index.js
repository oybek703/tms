import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import axiosInstance, {withToken} from '../../../../utils/axiosInstance'
import {toast} from 'react-toastify'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import RotateLeftIcon from '@material-ui/icons/RotateLeft'
import SaveIcon from '@material-ui/icons/Save'
import {useHistory} from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import {fetchGap, fetchGapManual} from '../../../../redux/actions'
import {getErrorMessage} from '../../../../utils'
import Loader from '../../../UI/Layout/Loader'
import Alert from '../../../UI/Layout/Alert'
import GapSimulationTable from './GapSimulationTable'
import GapSimulationDialog from './GapSimulationDialog'
import {makeStyles} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  buttonsRow: {
    marginBottom: 5
  },
  actionContent: {
    padding: '5px 10px'
  }
}))

function ActionContent({handleReset, handleSave}) {
  const classes = useStyles()
  return (
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
          <b> Для редактирования значения ячейки щелкните по
            этой
            ячейке.</b>
        </Typography>
      </div>
  )
}

const GapSimulation = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [newValue, setNewValue] = useState('')
  const [dialog, setDialog] = useState(false)
  const [editingCell, setEditingCell] = useState({})
  const { gapManual = {}, loading, error } = useSelector(state => state.gapManual)
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

  const handleEdit = useCallback(async function handleEdit () {
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
  },[dispatch, editingCell, newValue])

  const handleNewValueChange = useCallback(async function handleNewValueChange (e) {
    if (e.key === 'Enter') {
      await handleEdit()
    }
  },[handleEdit])

  const handleEditClick = useCallback( e => {
        const cellInfo = JSON.parse(e.target.dataset.cellinfo || '{}')
        setEditingCell(cellInfo)
        setDialog(true)
      },[])

  useEffect(() => {
    setNewValue(+(editingCell['numValue'] || 0).toFixed(2))
  }, [editingCell])
  const handleReset = useCallback(() => {
    const option = window.confirm(
        'Вы уверены, что хотите сбросить разрыв до исходного состояния?')
    if (option) {
      dispatch(fetchGapManual())
    }
  }, [dispatch])
  const handleSave = useCallback(async () => {
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
  },[dispatch, history])
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
  return (
    <Paper>
      {
        loading
          ? <Loader/>
          : error
          ? <Alert message={error}/> : <>
            <ActionContent handleReset={handleReset} handleSave={handleSave}/>
            {!dialog && <GapSimulationTable handleEditClick={handleEditClick} months={months}
                                            needsOfLiquidity={needsOfLiquidity} vlaLcrData={vlaLcrData}
                                            sourceOfLiquidity={sourceOfLiquidity}
                                            needsOfLiquidityTotal={needsOfLiquidityTotal}
                                            sourceOfLiquidityTotal={sourceOfLiquidityTotal}/>}
            <GapSimulationDialog dialog={dialog} editingCell={editingCell} setNewValue={setNewValue}
                                 handleClose={handleClose} setDialog={setDialog} handleEdit={handleEdit}
                                 handleNewValueChange={handleNewValueChange} newValue={newValue}/>
          </>
      }
    </Paper>
  )
}

export default GapSimulation