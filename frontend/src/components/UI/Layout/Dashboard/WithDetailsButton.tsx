import React, { PropsWithChildren } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'

interface WithDetailsButtonProps {
    link: string
}

const WithDetailsButton: React.FC<PropsWithChildren<WithDetailsButtonProps>> = ({children, link = '/'}) => {
    return (
        <>
            <Grid container justifyContent='flex-end'>
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