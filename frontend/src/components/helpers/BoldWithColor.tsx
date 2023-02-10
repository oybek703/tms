import React, { PropsWithChildren } from 'react'
import { Typography } from '@mui/material'

const BoldWithColor: React.FC<PropsWithChildren<{}>> = ({ children }) => {
	return (
		<Typography variant="body2" sx={{ color: '#fff' }}>
			<b>{children}</b>
		</Typography>
	)
}

export default BoldWithColor
