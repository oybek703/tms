import React from 'react'
import {Button, Grid, makeStyles, Typography} from "@material-ui/core"
import PanToolOutlinedIcon from '@material-ui/icons/PanToolOutlined'
import {Link} from "react-router-dom"

const useStyles = makeStyles(theme => ({
    mainBtn: {
        maxWidth: 220
    }
}))

const Forbidden = () => {
    const classes = useStyles()
    return (
        <Grid container direction='column' alignItems='center' justify='center'>
            <div>
              <Typography variant='h2' align='center'>
                <b><PanToolOutlinedIcon fontSize='large'/></b>
                <br/>
                <b>FORBIDDEN</b>
              </Typography>
              <Typography variant='h6' align='center'><b>Доступ запрещен</b></Typography>
              <Typography variant='h6' align='center'>Вы не имеете доступа к этой странице.</Typography>
              <br/>
            </div>
            <Button component={Link} to='/' className={classes.mainBtn}
                    color='secondary'
                    variant='contained'
                    size='small'>
                Вернуться на главная
            </Button>
        </Grid>
    )
}

export default Forbidden