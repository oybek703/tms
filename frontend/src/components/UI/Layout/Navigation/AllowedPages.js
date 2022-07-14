import React from 'react'
import { makeStyles} from '@material-ui/core/styles'
import {baseRoutes} from './Header'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'

const useStyles = makeStyles((theme) => ({
    title: {
        fontStyle: 'italic',
        color: '#767676',
        fontSize: 18,
        marginBottom: 10
    }
}))

export default function AllowedPages({setPages, pages = []}) {
    const classes = useStyles()
    const allowedPages = new Set(pages)
    const handleChange = (event) => {
        const route = event.target.name
        if(allowedPages.has(route)) {
            allowedPages.delete(route)
        } else {
            allowedPages.add(route)
        }
        setPages(allowedPages)
    }
    return (
        <div>
            <p className={classes.title}>Tick pages you want to allow:</p>
            {baseRoutes.map(({title, route}) => <FormControlLabel
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
