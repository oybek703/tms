import React from 'react'
import Grid from '@material-ui/core/Grid'
import './loader.css'
import {makeStyles} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    loaderContent: {
        margin: '0 auto',
        minHeight: 550,
        width: '60%',
        background: '#ffffff'
    }
}))

const Loader = () => {
    const classes = useStyles()
    return (
        <Grid className={classes.loaderContent}
              container justify='center' alignItems='center'>
            <div className="loader quantum-spinner"/>
        </Grid>
    )
}

export default Loader
