import React from 'react'
import { makeStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined'
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined'
import CheckCircleOutlineOutlinedIcon
    from '@material-ui/icons/CheckCircleOutlineOutlined'
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined'
import { Redirect } from 'react-router-dom'

const getBackGroundColor = type => {
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
const getColor = type => {
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
        backgroundColor: ({ type }) => getBackGroundColor(type),
        color: ({ type }) => getColor(type),
        borderRadius: '5px',
        margin: '1em auto',
        maxWidth: '40em',
        width: '90%',
        [theme.breakpoints.down('sm')]: {
            maxWidth: '20em'
        }
    }
}))

const Alert = (props) => {
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