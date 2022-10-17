import React, { PropsWithChildren } from 'react'
import { TableHead } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(theme => ({
	blueBackground: theme.mixins.blueBackground
}))

const BlueTableHead: React.FC<PropsWithChildren<{}>> = ({ children }) => {
	const classes = useStyles()
	return <TableHead className={classes.blueBackground}>{children}</TableHead>
}

export default BlueTableHead
