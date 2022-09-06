import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import Tooltip from '@material-ui/core/Tooltip'
import Zoom from '@material-ui/core/Zoom'
import UpdateOutlinedIcon from '@material-ui/icons/UpdateOutlined'
import { Avatar } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    'display': 'flex',
    'justifyContent': 'center',
    'flexWrap': 'wrap',
    'paddingTop': '2px'
  },
  chip: {
    cursor: 'default',
    fontStyle: 'italic'
  },
  chipLabelSmall: {
    paddingBottom: '3px',
    paddingLeft: '10px',
    paddingRight: '10px'
  }
}))


export default function LastUpdate({ label = 'LAST UPDATE', title = 'Последнее обновление' }) {
  const classes = useStyles()

  return (
    <Tooltip title={title} arrow TransitionComponent={Zoom} placement='right'>
      <div className={classes.root}>
        <Chip classes={{
          labelSmall: classes.chipLabelSmall
        }} className={classes.chip} size="small" variant='outlined'
        avatar={<Avatar><UpdateOutlinedIcon fontSize='small' color='inherit'/></Avatar>}
        label={label} color="primary"/>
      </div>
    </Tooltip>
  )
}
