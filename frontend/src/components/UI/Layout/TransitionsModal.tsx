import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import VisibilityIcon from '@material-ui/icons/Visibility'
import { IconButton } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    }
  })
)

function ViewIcon({ handleOpen = () => {} }) {
  return <IconButton title='Нажмите, чтобы просмотреть подробности' component='button' color='primary' onClick={handleOpen} size='small'>
    <VisibilityIcon fontSize='medium'/>
  </IconButton>
}

interface TransitionsModalProps {
  innerData: JSX.Element
}

const TransitionsModal: React.FC<TransitionsModalProps> = ({ innerData }) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  return (
    <div>
      <ViewIcon handleOpen={handleOpen}/>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            {innerData}
          </div>
        </Fade>
      </Modal>
    </div>
  )
}

export default TransitionsModal
