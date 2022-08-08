import React, { useCallback, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { TableExport } from 'tableexport'
import { IconButton, makeStyles } from '@material-ui/core'
import Popover from '@material-ui/core/Popover'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import excelImage from '../../../images/excel.png'

const useStyles = makeStyles((theme) => ({
  button: {
    textTransform: 'none',
    borderRadius: 0
  }
}))


interface ExportButtonProps {
    id: string
}

const ExportButton: React.FC<ExportButtonProps> = ({ id = 'table_id' }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])
  const export2Excel = useCallback(() => {
    const table = new TableExport(
            document.getElementById(id) as Node,
            {
              formats: ['xlsx'],
              position: 'top',
              exportButtons: false,
              trimWhitespace: true
            }
    )
    const exportData: any = table.getExportData()
    /* convert export data to a file for download */
    const xlsxData = exportData[id]['xlsx']
    table.export2file(
        xlsxData.data,
        xlsxData.mimeType,
        xlsxData.filename,
        xlsxData.fileExtension
    )
    table.remove()
    table.reset()
    handleClose()
  }, [id, handleClose])

  const open = Boolean(anchorEl)
  const popoverId = open ? 'simple-popover' : undefined
  return (
    <Grid container justifyContent='flex-start'>
      {/*
            //@ts-ignore*/}
      <IconButton aria-describedby={popoverId} variant="contained" color="primary" onClick={handleClick}>
        <MoreHorizIcon/>
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
          className={classes.button}
          startIcon={<img width={20}
            height={20} src={excelImage}
            alt="Export to Excel"/>}>
                    Экспорт в Excel
        </Button>
      </Popover>
    </Grid>
  )
}

export default ExportButton
