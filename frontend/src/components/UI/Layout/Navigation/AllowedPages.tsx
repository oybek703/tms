import React from 'react'
import { baseRoutes } from './Header'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Typography } from '@mui/material'
import { ISxStyles } from '../../../../interfaces/styles.interface'

const styles: ISxStyles = {
	title: {
		fontStyle: 'italic',
		color: '#767676',
		fontSize: 18,
		margin: '20px auto 10px'
	}
}

interface AllowedPagesProps {
	setPages: any
	pages: any
}

const AllowedPages: React.FC<AllowedPagesProps> = function ({ setPages, pages = [] }) {
	const allowedPages = new Set(pages)
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const route = event.target.name
		if (allowedPages.has(route)) {
			allowedPages.delete(route)
		} else {
			allowedPages.add(route)
		}
		setPages(allowedPages)
	}
	return (
		<div>
			<Typography component="p" sx={styles.title}>
				Tick pages you want to allow:
			</Typography>
			{baseRoutes.map(({ title, route }) => (
				<FormControlLabel
					key={route}
					control={<Checkbox checked={pages.includes(route)} onChange={handleChange} name={route} color="primary" />}
					label={title}
				/>
			))}
		</div>
	)
}

export default AllowedPages
