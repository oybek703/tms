import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import { baseRoutes } from './Header'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

const useStyles = makeStyles(theme => ({
  title: {
    fontStyle: 'italic',
    color: '#767676',
    fontSize: 18,
    marginBottom: 10
  }
}))

interface AllowedPagesProps {
    setPages: any
    pages: any
}

const AllowedPages: React.FC<AllowedPagesProps> = function({ setPages, pages = [] }) {
  const classes = useStyles()
  const allowedPages = new Set(pages)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const route = event.target.name
    if (allowedPages.has(route)) {
      allowedPages.delete(route)
    } else {
      allowedPages.add(route)
    }
    setPages(allowedPages)
  }
  return (
    <div>
      <p className={classes.title}>Tick pages you want to allow:</p>
      {baseRoutes.map(({ title, route }) => <FormControlLabel
        key={route}
        control={
          <Checkbox
            checked={pages.includes(route)}
            onChange={handleChange}
            name={route}
            color="primary" />
        }
        label={title}
      />)}
    </div>
  )
}

export default AllowedPages
