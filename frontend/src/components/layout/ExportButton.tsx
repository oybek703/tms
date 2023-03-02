import React, { useCallback, useState } from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { IconButton } from '@mui/material'
import Popover from '@mui/material/Popover'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import excelImage from '../../images/excel.png'
import { utils, writeFile } from 'sheetjs-style'
import { ExcelProcessor } from '../../utils/excelProcessor'

interface ExportButtonProps<T> {
	id: string
	data?: T
}

const ExportButton: React.FC<ExportButtonProps<Record<string, unknown>>> = ({ data, id = 'table_id' }) => {
	const [anchorEl, setAnchorEl] = useState(null)

	const handleClick = useCallback((event: any) => {
		setAnchorEl(event.currentTarget)
	}, [])

	const handleClose = useCallback(() => {
		setAnchorEl(null)
	}, [])
	const export2Excel = useCallback(() => {
		const tableElement = document.getElementById(id)
		const workbook = utils.table_to_book(tableElement)
		const workSheet = workbook.Sheets.Sheet1
		const excelProcessor = new ExcelProcessor(workSheet, data)
		if (id.startsWith('main-indicators')) excelProcessor.mainIndicators()
		if (id.startsWith('profit-and-lost')) excelProcessor.profitAndLost()
		writeFile(workbook, `${id}.xlsx`)
		handleClose()
	}, [id, data, handleClose])

	const open = Boolean(anchorEl)
	const popoverId = open ? 'simple-popover' : undefined
	return (
		<Grid container justifyContent="flex-start">
			{/*
            //@ts-ignore*/}
			<IconButton aria-describedby={popoverId} variant="contained" color="primary" onClick={handleClick} size="large">
				<MoreHorizIcon />
			</IconButton>
			<Popover
				id={popoverId}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transitionDuration={{
					appear: 100,
					exit: 100
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
			>
				<Button
					variant="outlined"
					color="primary"
					onClick={export2Excel}
					sx={{ textTransform: 'none', borderRadius: 0 }}
					startIcon={<img width={20} height={20} src={excelImage} alt="Export to Excel" />}
				>
					Экспорт в Excel
				</Button>
			</Popover>
		</Grid>
	)
}

export default ExportButton
