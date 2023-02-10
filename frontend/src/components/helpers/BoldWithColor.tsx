import React, { PropsWithChildren } from 'react'
import { Typography } from '@mui/material'
import { ISxStyles } from '../../interfaces/styles.interface'

const BoldWithColor: React.FC<PropsWithChildren<{ sx?: ISxStyles }>> = ({ children, sx }) => {
	return (
		<Typography variant="body2" sx={{ color: '#fff', ...sx }}>
			<b>{children}</b>
		</Typography>
	)
}

export default BoldWithColor
