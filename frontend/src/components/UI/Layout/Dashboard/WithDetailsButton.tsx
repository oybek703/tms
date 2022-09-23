import React, { PropsWithChildren } from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'

interface WithDetailsButtonProps {
    link: string
}

const WithDetailsButton: React.FC<PropsWithChildren<WithDetailsButtonProps>> = ({ children, link = '/' }) => {
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
