import React from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'

const GapSimulationDialog = ({dialog = false, handleClose, editingCell, setDialog, handleEdit, newValue, handleNewValueChange, setNewValue}) => {
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
              Источник: {editingCell['source'] === 'AUTO'
                ? 'Авто'
                : 'Ручной'}<br/>
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
            <Button variant='outlined'
                    onClick={handleEdit}
                    color="primary">
              Обновить
            </Button>
          </DialogActions>
        </Dialog>
      </>
  )
}

export default GapSimulationDialog