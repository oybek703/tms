import * as React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import { Redirect, useHistory } from 'react-router-dom'

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

interface AlertProps {
	type?: string
	message?: string
	icon?: boolean
}

const Alert: React.FC<AlertProps> = props => {
	const { push } = useHistory()
	const { type = 'danger', message = 'Unexpected internal server error!', icon = true } = props
	if (message === 'access_denied') return <Redirect to={'/403'} />
	if (message === 'Session expired.') push('/login')
	return (
		<List
			disablePadding
			sx={{
				backgroundColor: getBackGroundColor(type),
				color: getColor(type),
				borderRadius: '5px',
				margin: '1em auto',
				maxWidth: '40em',
				width: '90%'
			}}
		>
			<ListItem>
				<ListItemIcon>
					{type === 'success' && <CheckCircleOutlineOutlinedIcon />}
					{type === 'warning' && <ReportProblemOutlinedIcon />}
					{type === 'info' && <HelpOutlineOutlinedIcon />}
					{!type && icon && <ErrorOutlineOutlinedIcon />}
				</ListItemIcon>
				<ListItemText>{message.toString() || 'Something went wrong, please check network connection.'}</ListItemText>
			</ListItem>
		</List>
	)
}

export default Alert
