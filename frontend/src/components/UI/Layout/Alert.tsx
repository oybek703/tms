import * as React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import CheckCircleOutlineOutlinedIcon
  from '@mui/icons-material/CheckCircleOutlineOutlined'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import { Redirect } from 'react-router-dom'

const getBackGroundColor = (type: string) => {
  switch (type) {
    case 'success':
      return '#b1c8b2'
    case 'warning':
      return '#f8ce94'
    case 'info':
      return '#9ac6e9'
    default:
      return '#eaabab'
  }
}

const getColor = (type: string) => {
  switch (type) {
    case 'success':
      return '#4caf50'
    case 'warning':
      return '#ff9800'
    case 'info':
      return '#2196f3'
    default:
      return '#f44336'
  }
}

const useStyles = makeStyles(theme => ({
  alert: {
    backgroundColor: ({ type }: {type: string}) => getBackGroundColor(type),
    color: ({ type }: {type: string}) => getColor(type),
    borderRadius: '5px',
    margin: '1em auto',
    maxWidth: '40em',
    width: '90%',
    [theme.breakpoints.down('md')]: {
      maxWidth: '20em'
    }
  }
}))

interface AlertProps {
    type?: string
    message?: string
    icon?: boolean
}

const Alert: React.FC<AlertProps> = props => {
  // @ts-ignore
  const classes = useStyles(props)
  const { type, message = 'Unexpected internal server error!', icon = true } = props
  if (message === 'access_denied') return <Redirect to={'/403'}/>
  return (
    <List disablePadding classes={{ root: classes.alert }}>
      <ListItem>
        <ListItemIcon>
          {type === 'success' && <CheckCircleOutlineOutlinedIcon/>}
          {type === 'warning' && <ReportProblemOutlinedIcon/>}
          {type === 'info' && <HelpOutlineOutlinedIcon/>}
          {!type && icon && <ErrorOutlineOutlinedIcon/>}
        </ListItemIcon>
        <ListItemText>
          {message.toString() ||
                  'Something went wrong, please check network connection.'}
        </ListItemText>
      </ListItem>
    </List>
  )
}

export default Alert
