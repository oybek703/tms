import React from 'react'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Zoom from '@mui/material/Zoom'
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined'
import { Avatar, Grid } from '@mui/material'

export default function LastUpdate({ label = 'LAST UPDATE', title = 'Последнее обновление' }) {
	return (
		<Tooltip title={title} arrow TransitionComponent={Zoom} placement="right">
			<Grid>
				<Chip
					sx={{
						padding: '3px 10px',
						cursor: 'default',
						fontStyle: 'italic'
					}}
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
			</Grid>
		</Tooltip>
	)
}
