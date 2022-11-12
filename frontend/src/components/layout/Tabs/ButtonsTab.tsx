import React from 'react'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import { v4 as uuid } from 'uuid'
import { Grid } from '@mui/material'
import globalStyles from '../../../styles/globalStyles'

interface ButtonsTabProps {
	handleChange: (code: string) => void
	active?: string
	titles: { title: string; code: string }[]
}

const ButtonTabs: React.FC<ButtonsTabProps> = ({ handleChange = () => {}, active = 'all', titles = [] }) => {
	return (
		<Grid sx={globalStyles.marginBottom10}>
			<ButtonGroup size="small" color="primary">
				{titles.map(({ title, code }, i) => (
					<Button
						sx={globalStyles.tabBtn}
						onClick={handleChange.bind(null, code)}
						size="medium"
						key={uuid()}
						variant={`${active === code ? 'contained' : 'outlined'}`}
					>
						{title}
					</Button>
				))}
			</ButtonGroup>
		</Grid>
	)
}

export default ButtonTabs
