import React, {Fragment} from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import {Link} from 'react-router-dom'

const WithDetailsButton = ({children, link = '/', loading = false}) => {
    return (
        <>
            <Grid container justify='flex-end'>
                <Button variant='contained' color='primary'
                        component={Link} to={link}>
                    Подробнее
                </Button>
            </Grid>
            <br/>
            {children}
        </>
    )
}

export default WithDetailsButton