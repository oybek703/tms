import React from 'react'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import { v4 as uuid } from 'uuid'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(theme => ({
	content: {
		marginBottom: 10
	},
	btn: theme.mixins.tabBtn
}))

interface ButtonsTabProps {
	handleChange: (code: string) => void
	active?: string
	titles: { title: string; code: string }[]
}

const ButtonTabs: React.FC<ButtonsTabProps> = ({ handleChange = () => {}, active = 'all', titles = [] }) => {
	const classes = useStyles()
	return (
		<div className={classes.content}>
			<ButtonGroup size="small" color="primary">
				{titles.map(({ title, code }, i) => (
					<Button
						classes={{ root: classes.btn }}
						onClick={handleChange.bind(null, code)}
						size="medium"
						key={uuid()}
						variant={`${active === code ? 'contained' : 'outlined'}`}
					>
						{title}
					</Button>
				))}
			</ButtonGroup>
		</div>
	)
}

export default ButtonTabs
