import React, {useState} from 'react'
import CardContent from '@material-ui/core/CardContent'
import {Typography} from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import {useDispatch} from 'react-redux'
import axiosInstance, {withToken} from '../../../../utils/axiosInstance'
import {SET_MIO} from '../../../../redux/actions/types'
import {toast} from 'react-toastify'

const MioGm = () => {
    const dispatch = useDispatch()
    const [mioDate, setMioDate] = useState('')
    const [mio, setMio] = useState('')
    async function handleMioSubmit(event) {
        event.preventDefault()
        if(new Date(mioDate) > new Date()) {
            toast.error('Дата не должна быть больше, чем сегодня.')
            return
        }
        try {
            const {data: {message}} = await axiosInstance.put(
                `/api/gm/setmio`,
                {mio, mioDate},
                withToken()
            )
            toast.success(message)
            dispatch({type: SET_MIO})
            setMio('')
            setMioDate('')
        } catch (e) {
            const {response = {}} = e
            const {data = {}} = response
            const {message} = data
            toast.error(message)
        }
    }
    return (
        <>
            <Card>
            <form onSubmit={handleMioSubmit}>
                <CardContent>
                    <Typography component='b' variant='h5' gutterBottom>
                        Непокрытый текущий аккредитив (МИО)
                    </Typography>
                    <hr/>
                    <Typography>
                        Пожалуйста, добавьте значение MIO, если оно изменилось, в противном случае
                        оно будет обновлено для выбранной даты, и новое значение не будет добавлено. &nbsp;
                        <b>например:</b> 317700000.00 (в номинале)
                    </Typography>
                    <br/>
                        <TextField
                            required
                            id="gm-mio"
                            type='number'
                            margin='dense'
                            label="МИО"
                            value={mio}
                            onChange={({target: {value}}) => setMio(value)}
                            autoComplete='off'
                            placeholder='317700000.00'
                            variant="outlined"
                        /> &nbsp;
                        <TextField
                            required
                            id="mio_date"
                            margin='dense'
                            variant='outlined'
                            label='Date'
                            value={mioDate}
                            onChange={({target: {value}}) => setMioDate(value)}
                            type="date"
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                </CardContent>
                <CardActions>
                    <Button type='submit'
                            size="small" variant='contained' color='primary'>
                        Добавлять
                    </Button>
                </CardActions>
            </form>
            </Card>
        </>
    )
}

export default MioGm