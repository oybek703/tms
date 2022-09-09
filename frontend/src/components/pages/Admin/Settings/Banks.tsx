import React, {Fragment, useEffect, useState} from 'react'
import Grid from '@material-ui/core/Grid'
import {makeStyles, Table, TableBody, TableContainer, TableHead, TableRow, Typography} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import AddTwoToneIcon from '@material-ui/icons/AddTwoTone'
import TableCell from '@material-ui/core/TableCell'
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import {baseRoutes} from '../../../UI/Layout/Navigation/Header'
import Loader from '../../../UI/Layout/Loader'
import Alert from '../../../UI/Layout/Alert'
import Paper from '@material-ui/core/Paper'
import AddUser from '../AddUser'
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import useActions from '../../../../hooks/useActions'
import {toast} from "react-toastify";
import onChange = toast.onChange;

const useStyles = makeStyles((theme) => ({
    table: {
        marginTop: 20,
        backgroundColor: '#fff'
    },
    actionCol: {
        textAlign: 'center',
        whiteSpace: 'nowrap'
    },
    actionBtn: {
        color: 'white',
        background: 'gray',
        padding: 3,
        borderRadius: 5
    },
    paddingMain: {
        padding: 30
    },
    formControl: {
        width: '200px'
    },
    buttonWith: {
        minWidth: '40px'
    }
}))


const updatedBaseRoutes = [...baseRoutes].reduce((acc: any, val: any) => {
    acc[val['route']] = val['title']
    return acc
}, {})

const Banks = () => {
    // const [addNewUser, setAddNewUser] = useState(false)
    const classes = useStyles()
    const {banks, loading, error} = useTypedSelector((state) => state.banks)
    // const addUserState = useTypedSelector((state) => state.addUser)
    const getBanksState = useTypedSelector((state) => state.banks)
    const {fetchBanks} = useActions()

    const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        // setRating(e.target.value)
    }

    // const checkAction = () => {
    //   if (addNewUser) {
    //     setAddNewUser(false)
    //   } else if (!addNewUser) {
    //     setAddNewUser(true)
    //   }
    // }

    // useEffect(() => {
    //   if (addUserState.state === 'added') setAddNewUser(false)
    // }, [addUserState.state])

    useEffect(() => {
        // if (!addNewUser || !addNewUser)
        fetchBanks()
    }, [fetchBanks])
    console.log(getBanksState)
    return (
        <Paper className = {classes.paddingMain} >
            {
                loading ?
                    <Loader / > :
                    error ?
                        <Alert message = {error} /> :
                        < >
                        <Grid container justifyContent = 'space-between' alignItems = 'center' >
                <Grid item >
                <Typography><b>{'All Banks'} < /b></Typography >
            </Grid>
            < Grid
    item >
    <Button
        endIcon = { < AddTwoToneIcon / >
}
    // onClick={() => checkAction()}
    disabled = {loading}
    size = 'small'
    variant = 'contained'
    color = 'primary' > {'Add bank'} < /Button>
    < /Grid>
    < /Grid>
    < hr / >
    <TableContainer>
        <Table size = 'small'
    className = {classes.table} >
    <TableHead>
        <TableRow>
            <TableCell align = "center" > <b>CODE < /b></
    TableCell >
    <TableCell align = "center" > <b>NAME < /b></
    TableCell >
    <TableCell align = "center" > <b>RATING < /b></
    TableCell >
    <TableCell align = "center" > <b>RESIDENCY < /b></
    TableCell >
    </TableRow>
    < /TableHead>
    < TableBody >
    {
        banks.map((bank: any, i: number) => (
            <TableRow key = {i} >
            <TableCell align = 'center' > {bank['CLIENT_CODE']} < /TableCell>
                < TableCell align = 'center' > {bank['BANK_NAME']} < /TableCell>
        < FormControl variant = "outlined" className = {classes.formControl} >
        <Select
            value = {bank['RATING_STATUS']}
        onChange = {handleChange}
        id = "demo-simple-select-outlined"
        // inputProps={{ 'aria-label': 'Without label' }}
        >
        <MenuItem value = {'Инвестиционный'} > Инвестиционный < /MenuItem>
            < MenuItem value = {'Не инвестиционный'} > Не инвестиционный</MenuItem>
    < /Select>
    < /FormControl>
    < TableCell
    align = 'center' > {bank['RESIDENCY']} < /TableCell>
        < /TableRow>
))
}
    </TableBody>
    < /Table>
    < /TableContainer>
    < />
}
    </Paper>
)
}

export default Banks
