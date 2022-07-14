import React, {Fragment} from 'react'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import {v4 as uuid} from 'uuid'
import {makeStyles} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    btn: theme.mixins.tabBtn
}))


export default function CorrespondentTabs({handleChange = () => {}, active = 'main'}) {
    const titles = [
        {title: 'Корреспондентские счета', code: 'main'},
        {title: 'Лимиты', code: 'limit'}
    ]
    const classes = useStyles()
    return (
        <Fragment>
            <ButtonGroup disableElevation size='small' color="primary">
                {titles.map(({title, code}, i) =>
                    <Button classes={{root: classes.btn}}
                            onClick={handleChange.bind(null, code)}
                            size='medium'
                            key={uuid()}
                            variant={`${active === code ? 'contained' : 'outlined'}`}>
                        {title}
                    </Button>)}
            </ButtonGroup>
            <hr/>
        </Fragment>
    )
}
