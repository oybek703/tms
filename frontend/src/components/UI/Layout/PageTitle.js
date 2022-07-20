import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles, Typography } from '@material-ui/core'
import Card from '@material-ui/core/Card'

const useStyles = makeStyles(theme => ({
    main: {
        marginBottom: 20,
        backgroundColor: '#eee',
        borderRadius: 5
    },
    cardContent: {
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between'
    },
    title: {
        textTransform: 'uppercase',
        backgroundColor: 'rgb(248 63 55)',
        padding: '5px 10px',
        borderRadius: 5,
        color: 'white'
    }
}))

const PageTitle = ({ title }) => {
    const classes = useStyles()
    return (
        <>
            <Card variant='outlined' className={classes.main}>
                <Grid
                    classes={{ root: classes.cardContent }}
                    component={Grid} container
                    justify='space-between'>
                    <Typography className={classes.title}
                                variant='body1'><b>{title}</b></Typography>
                </Grid>
            </Card>
        </>
    )
}

export default PageTitle