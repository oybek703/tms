import React from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'

interface GapSimulationDialogProps {
  dialog: boolean
  handleClose: () => void
  editingCell: any
  setDialog: any
  handleEdit: () => void
  newValue: string
  handleNewValueChange: any
  setNewValue: (value: string) => void
}

const GapSimulationDialog: React.FC<GapSimulationDialogProps> = ({
  dialog = false, handleClose, editingCell, setDialog,
  handleEdit, newValue, handleNewValueChange, setNewValue }) => {
  return (
    <>
      <Dialog open={dialog} onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Обновить значение</DialogTitle>
        <DialogContent>
          <DialogContentText>
              Тип: {editingCell['type']}<br/>
              Имя: {editingCell['name']}<br/>
              Месяц(год): {editingCell['month']}<br/>
              Имя ячейки: {editingCell['cellName']}<br/>
              Текущий: {editingCell['current']}<br/>
              Источник: {editingCell['source'] === 'AUTO' ?
                'Авто' :
                'Ручной'}<br/>
          </DialogContentText>
          <TextField
            autoFocus
            value={newValue}
            onKeyDown={handleNewValueChange}
            onChange={({ target: { value } }) => setNewValue(value)}
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
          <Button variant='outlined' onClick={handleEdit} color="primary">
              Обновить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default GapSimulationDialog
