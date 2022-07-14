import React from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import {CardActionArea, makeStyles, Typography} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    main: {
        marginBottom: 20,
        backgroundColor: '#eee'
    },
    cardContent: {
        padding: '10px',
        cursor: 'auto',
        display: 'flex',
        justifyContent: 'space-between'
    },
    title: {
        textTransform: 'uppercase',
        transform: 'scale(1)',
        backgroundColor: 'rgb(248 63 55)',
        padding: '5px 10px',
        borderRadius: 5,
        color: 'white',
        '&:hover': {
            textTransform: 'uppercase',
            cursor: 'pointer',
            transform: 'scale(1.01)',
        }
    }
}))

const PageTitle = ({title}) => {
    const classes = useStyles()
    return (
        <>
            <Card variant='outlined' className={classes.main} >
                <CardActionArea disableRipple disableTouchRipple
                                classes={{root: classes.cardContent}}
                                component={Grid} container justify='space-between'>
                <Typography className={classes.title} variant='body1'><b>{title}</b></Typography>
                </CardActionArea>
            </Card>
        </>
    )
}

export default PageTitle