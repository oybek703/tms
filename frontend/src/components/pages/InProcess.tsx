import React from 'react'
import { makeStyles, Typography } from '@material-ui/core'
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard'

const useStyles = makeStyles((theme) => ({
  inner: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    border: '3px solid #333',
    borderRadius: 10,
    padding: 40,
  },
}))

const InProcess = () => {
  const classes = useStyles()
  return (
    <>
      <div className={classes.inner}>
        <Typography align='center' variant='h3'>
                    Page is in development process.
        </Typography>
        <Typography align='center' component='i'>
                    Page will be available as soon as finished development process.
        </Typography>
        <hr/>
        <br/>
        <Typography align='center'>
          <DeveloperBoardIcon fontSize='large'/>
        </Typography>
      </div>
    </>
  )
}

export default InProcess
