import React, { PropsWithChildren } from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import globalStyles from '../../../styles/global-styles'
import { ISxStyles } from '../../../interfaces/styles.interface'
import { mergeStyles } from '../../../utils'

interface WrapperProps {
	isHead: boolean
}

const Wrapper: React.FC<PropsWithChildren<WrapperProps>> = ({ children, isHead = true }) => {
	return isHead ? <TableHead>{children}</TableHead> : <>{children}</>
}

interface TableCapProps {
	rows: any
	text: string
	redBack?: boolean
	isGrey?: boolean
	isHead?: boolean
	cellStyles?: ISxStyles
	textAlign?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined
}

const TableCap: React.FC<TableCapProps> = ({
	rows,
	text,
	redBack = false,
	isGrey = false,
	isHead = true,
	cellStyles = {},
	textAlign = 'right'
}) => {
	return (
		<Wrapper isHead={isHead}>
			<TableRow>
				{new Array(rows - 1).fill('').map((c, i) => (
					<TableCell sx={mergeStyles(globalStyles.noBorder, cellStyles)} key={i}>
						<b>{''}</b>
					</TableCell>
				))}
				<TableCell
					sx={{
						...globalStyles.noBorder,
						...cellStyles,
						color: isGrey || redBack ? '#fff' : '#000',
						backgroundColor: isGrey ? `#7794aa` : redBack ? 'red' : 'fff',
						fontSize: 14
					}}
					align={textAlign}
				>
					<b>
						<i>{text}</i>
					</b>
				</TableCell>
			</TableRow>
		</Wrapper>
	)
}

export default TableCap
