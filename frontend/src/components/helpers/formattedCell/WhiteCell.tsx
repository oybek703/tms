import React, { PropsWithChildren } from 'react'
import TableCell from '@mui/material/TableCell'
import globalStyles from '../../../styles/globalStyles'

interface WhiteCellProps {
	rowSpan?: number
	colSpan?: number
	align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'
}

const WhiteCell: React.FC<PropsWithChildren<WhiteCellProps>> = props => {
	return (
		<TableCell sx={{ ...globalStyles.noWrap, color: '#fff' }} {...props}>
			{props.children}
		</TableCell>
	)
}

export default WhiteCell
