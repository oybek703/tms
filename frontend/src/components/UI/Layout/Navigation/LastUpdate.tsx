import React from 'react'
import { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Zoom from '@mui/material/Zoom'
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined'
import { Avatar } from '@mui/material'

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
		flexWrap: 'wrap',
		paddingTop: '2px'
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
		<Tooltip title={title} arrow TransitionComponent={Zoom} placement="right">
			<div className={classes.root}>
				<Chip
					classes={{
						labelSmall: classes.chipLabelSmall
					}}
					className={classes.chip}
					size="small"
					variant="outlined"
					avatar={
						<Avatar>
							<UpdateOutlinedIcon fontSize="small" color="inherit" />
						</Avatar>
					}
					label={label}
					color="primary"
				/>
			</div>
		</Tooltip>
	)
}
