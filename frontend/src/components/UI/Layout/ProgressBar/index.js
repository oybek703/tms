import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'

function chooseProgressColor (value = 0) {
  if(value >=0 && value < 50) return '#7b7b7b'
  if(value >=50 && value < 60) return 'green'
  if(value >=60 && value < 80) return 'orange'
  if(value >=80 && value < 100) return '#a44b00'
  if(value >= 100) return 'red'
}

const useStyles = makeStyles(theme => ({
  root: {
    height: 15,
    borderRadius: 0,
    position: 'relative',
    backgroundColor: '#ccc',
    minWidth: 100
  },
  bar: {
    borderRadius: 0,
    backgroundColor: ({value}) => chooseProgressColor(value)
  },
  percent: {
    position: 'absolute',
    top: -1,
    left: 0,
    bottom: 0,
    right: 0,
    fontSize: '0.8rem',
    textAlign: 'center',
    color: ({ value }) => (value >= 0 && value < 50) ? '#000': '#fff'
  }
}))

export default function ProgressBar ({ value = 0 }) {
  const classes = useStyles({ value })

  return (
    <div className={classes.root}>
      <LinearProgress
        classes={{
          root: classes.root,
          bar: classes.bar
        }}
        variant="determinate" value={value > 100 ? 100 : +value}/>
      <span className={classes.percent} title={value}> &nbsp; {value > 100
        ? 'больше 100'
        : `${value}%`}</span>
    </div>
  )
}
