import React from 'react'
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined'
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { formatNumber } from '../../../utils'
import { Variant } from '@mui/material/styles/createTypography'
import globalStyles from '../../../styles/globalStyles'

interface FormattedCellProps {
	number: number
	textVar?: Variant
	curr?: string
	alignText?: string
	iconSize?: 'inherit' | 'large' | 'medium' | 'small'
	dashForZero?: boolean
}

const FormattedCell: React.FC<FormattedCellProps> = ({
	number,
	textVar = 'caption',
	curr = '',
	alignText = 'center',
	iconSize = 'medium',
	dashForZero = false
}) => {
	if (dashForZero && number === 0) return <>{'-'}</>
	return (
		<Grid sx={globalStyles.noWrap} container component="span" alignItems="center" justifyContent={alignText}>
			{number < 0 ? (
				<ArrowDropDownOutlinedIcon color="error" fontSize={iconSize} />
			) : (
				<ArrowDropUpOutlinedIcon sx={globalStyles.grow} fontSize={iconSize} />
			)}
			{
				<Typography variant={`${textVar}`} component="b" sx={number < 0 ? globalStyles.down : globalStyles.grow}>
					{formatNumber(Math.abs(number))} {curr}
				</Typography>
			}
		</Grid>
	)
}

export default FormattedCell
