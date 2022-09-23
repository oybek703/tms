import * as React from 'react'
import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import Card from '@mui/material/Card'

const useStyles = makeStyles((theme) => ({
  main: {
    marginBottom: 20,
    backgroundColor: '#eee',
    borderRadius: 5
  },
  cardContent: {
    padding: '10px',
    display: 'flex',
    justifyContent: 'flex-start'
  },
  title: {
    textTransform: 'uppercase',
    backgroundColor: 'rgb(248 63 55)',
    padding: '5px 10px',
    borderRadius: 5,
    color: 'white',
    marginRight: 10
  }
}))

interface PageTitleProps {
    title?: string
    additionalContent?: JSX.Element
}

const PageTitle: React.FC<PageTitleProps> = ({ title, additionalContent }) => {
  const classes = useStyles()
  return (
    <>
      <Card variant='outlined' className={classes.main}>
        <Grid
          classes={{ root: classes.cardContent }}
          component={Grid} container alignItems='center'>
          <Typography className={classes.title}
            variant='body1'>
            <b>{title}</b>
          </Typography>
          {additionalContent}
        </Grid>
      </Card>
    </>
  )
}

export default PageTitle
