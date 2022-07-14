import React, {useCallback, useState} from 'react'
import CardContent from '@material-ui/core/CardContent'
import {makeStyles, Typography} from '@material-ui/core'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import {useDispatch} from 'react-redux'
import axiosInstance, {withToken} from '../../../../utils/axiosInstance'
import {UPDATE_CBN} from '../../../../redux/actions/types'
import Alert from '../Alert'

const useStyles = makeStyles(theme => ({
    editIcon: {
        textTransform: 'none'
    }
}))

const CbnUpdate = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [updateMsg, setUpdateMsg] = useState('')
    const [dialog, setDialog] = useState(false)
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [cbNorm, setCbNorm] = useState('')
    const [dateError, setDateError] = useState('')
    const handleDialogClose = useCallback(async (event) => {
        event.preventDefault()
        if (toDate > fromDate) {
            try {
                const {data: {message}} = await axiosInstance.put(
                    `/api/calcfor/updatecbn`,
                    {fromDate, toDate, cbNorm},
                    withToken()
                )
                localStorage.removeItem('calcfor')
                dispatch({type: UPDATE_CBN})
                setUpdateMsg(message)
                setDialog(false)
                setToDate('')
                setFromDate('')
                setCbNorm('')
                setTimeout(() => setUpdateMsg(''), 3000)
            } catch (e) {
                console.log(e)
            }
        } else {
            setDateError('To date must be bigger than from date.')
        }
    }, [cbNorm, dispatch, fromDate, toDate])

    return (
        <>
            <Card>
                <CardContent>
                    {updateMsg && <Grid container justify='flex-start'>
                        <Alert type='success'
                               message={updateMsg}/>
                    </Grid>}
                    <Typography component='b' variant='h5' gutterBottom>
                        Обновить или ввести норматив центрального банка за период
                    </Typography>
                    <hr/>
                    <Typography variant="body2">
                        Для обновления норматив центрального банка введите число полученное от центрального банка разделив на 1000,
                         &nbsp;
                        <b>например:</b> если норматив центрального банка равен 883522858640.53,
                        тогда вам нужно ввести 883522858.64
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={() => setDialog(true)}
                            className={classes.editIcon}
                            size="small" variant='contained' color='primary'>
                        Нажмите, чтобы обновить
                    </Button>
                </CardActions>
            </Card>
            <Dialog open={dialog} onClose={() => setDialog(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update CB Norm</DialogTitle>
                <form onSubmit={handleDialogClose}>
                    <DialogContent>
                        <Grid container spacing={3} justify='space-between' alignItems='center'>
                            <Grid item>
                                <TextField
                                    required
                                    id="from_date"
                                    label="From"
                                    value={fromDate}
                                    onChange={({target: {value}}) => setFromDate(value)}
                                    type="date"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    required
                                    id="to_date"
                                    label="To"
                                    value={toDate}
                                    onChange={({target: {value}}) => setToDate(value)}
                                    type="date"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={!!dateError}
                                    helperText={dateError}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            required
                            autoFocus
                            margin="dense"
                            id="norm"
                            placeholder='883522858.64'
                            label="CB Norm"
                            value={cbNorm}
                            onChange={({target: {value}}) => setCbNorm(value)}
                            type="number"
                            inputProps={{step: 'any'}}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button variant='outlined' onClick={() => setDialog(false)} color="primary">
                            Cancel
                        </Button>
                        <Button type='submit' variant='outlined' color="primary">
                            Update
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default CbnUpdate